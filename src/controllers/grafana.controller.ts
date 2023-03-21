import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {isEmpty} from 'lodash';
import logger from '../helpers/logger';
import {GrafanaDataSourceService, GrafanaOrgAdminService, GrafanaOrgAuthService} from '../services';
import {GrafanaDashboardService} from '../services/grafana-dashboard.service';
import {GrafanaUserService} from '../services/grafana-user.service';

export class GrafanaController {
  constructor(
    @service(GrafanaOrgAdminService)
    public grafanaAdminService: GrafanaOrgAdminService,
    @service(GrafanaOrgAuthService)
    public grafanaAuthService: GrafanaOrgAuthService,
    @service(GrafanaDataSourceService)
    public grafanaDatasourceService: GrafanaDataSourceService,
    @service(GrafanaUserService)
    public grafanaUserService: GrafanaUserService,
    @service(GrafanaDashboardService)
    public grafanaDashboardService: GrafanaDashboardService,
  ) { }


  @post('/internal/v1/onboard/grafana')
  async addClientOnGrafana(
    @requestBody()
    body: {
      orgId: string,
      adminEmail: string
    },
  ): Promise<any> {
    try {
      const {orgId: anchorOrgId, adminEmail} = body;
      const authKey = await this.grafanaAuthService.getGrafanaApiKey() ?? "";
      await this.grafanaAdminService.switchGrafanaOrg('1');
      await this.grafanaAdminService.getCurrentOrg(authKey);
      const grafanaOrgId = (await this.grafanaAdminService.createGrafanaOrg(anchorOrgId))?.toString() ?? "";
      console.log('grafana org Id - ', grafanaOrgId);
      if (isEmpty(grafanaOrgId.toString())) {
        console.log('error in org creation');
        return;
      }

      await this.grafanaAdminService.switchGrafanaOrg(grafanaOrgId);
      const adminAuthKey = await this.grafanaAuthService.getGrafanaApiKey() ?? "";
      await this.grafanaAdminService.getCurrentOrg(adminAuthKey);
      await this.grafanaUserService.createGrafanaOrgAdminUser(anchorOrgId, adminEmail, adminAuthKey);

      await this.grafanaDatasourceService.createGrafanaInfluxDataSource(grafanaOrgId, anchorOrgId, adminAuthKey);
      await this.grafanaDashboardService.createNewGrafanaDashboard(anchorOrgId, adminAuthKey);
    } catch (error) {
      logger.error(error);
    }
  }
}

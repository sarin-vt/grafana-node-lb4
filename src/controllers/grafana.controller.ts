import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import logger from '../helpers/logger';
import {GrafanaDataSourceService, GrafanaOrgAdminService, GrafanaOrgAuthService} from '../services';

export class GrafanaController {
  constructor(
    @service(GrafanaOrgAdminService)
    public grafanaAdminService: GrafanaOrgAdminService,
    @service(GrafanaOrgAuthService)
    public grafanaAuthService: GrafanaOrgAuthService,
    @service(GrafanaDataSourceService)
    public grafanaDatasourceService: GrafanaDataSourceService,
  ) { }

  @post('/internal/v1/onboard/grafana')
  async addClientOnGrafana(
    @requestBody()
    body: {
      orgId: string,
      grafanaOrgId: string
    },
  ): Promise<any> {
    try {
      const {orgId, grafanaOrgId} = body;
      this.grafanaDatasourceService.createGrafanaInfluxDataSource(grafanaOrgId, orgId);
    } catch (error) {
      logger.error(error);
    }
  }
}

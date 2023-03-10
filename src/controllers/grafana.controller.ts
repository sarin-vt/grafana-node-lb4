import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {GrafanaOrgAdminService} from '../services';

export class GrafanaController {
  constructor(
    @service(GrafanaOrgAdminService)
    public grafanaService: GrafanaOrgAdminService,
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




    } catch (error) {

    }
  }
}

import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {GRAFANA_ADMIN_AUTH_URL, INFLUX_ENDPOINT, INFLUX_TOKEN, TOKEN_AUTH_URL} from '../constants';
import logger from '../helpers/logger';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaDataSourceService {
  constructor() { }

  public createGrafanaInfluxDataSource = async (grafanaOrgId: string, anchorOrgId: string): Promise<boolean | undefined> => {
    const influxCreateDatasourceApi = '/api/datasources';
    logger.info(`Searching grafana ORGs list by name - '${anchorOrgId}'.`);

    try {
      await axios({
        method: 'post',
        baseURL: TOKEN_AUTH_URL,
        url: influxCreateDatasourceApi,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${GRAFANA_ADMIN_AUTH_URL}`
        },
        data: {
          "orgId": grafanaOrgId,
          "name": `${anchorOrgId}-influx-cloud`,
          "type": "influxdb",
          "access": "proxy",
          "url": INFLUX_ENDPOINT,
          "jsonData": {
            "defaultBucket": anchorOrgId,
            "httpMode": "POST",
            "organization": "Anchor",
            "version": "Flux"
          },
          "secureJsonData": {
            "token": INFLUX_TOKEN
          }
        }
      });

      return true;
    } catch (error) {
      logger.error(`Searching grafana ORGs list by name - '${anchorOrgId}'.`);
      return false;
    }
  }
}

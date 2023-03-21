import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {INFLUX_ENDPOINT, INFLUX_TOKEN, TOKEN_AUTH_URL} from '../constants';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaDataSourceService {
  constructor() { }

  public createGrafanaInfluxDataSource = async (grafanaOrgId: string, anchorOrgId: string, adminAuthKey: string): Promise<boolean | undefined> => {
    const influxCreateDatasourceApi = '/api/datasources';
    console.log(`Creating influx data source for - '${anchorOrgId}'`);

    try {
      await axios({
        method: 'post',
        baseURL: TOKEN_AUTH_URL,
        url: influxCreateDatasourceApi,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminAuthKey}`
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
      console.log(`Error while creating influx datasource for - '${anchorOrgId}'.`);
      console.log(error);
      return false;
    }
  }
}

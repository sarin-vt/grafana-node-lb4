import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {GRAFANA_ADMIN_AUTH_URL} from '../constants';
import logger from '../helpers/logger';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaOrgAuthService {
  constructor() { }

  public getGrafanaApiKey = async (): Promise<string | undefined> => {
    logger.info(`Requesting new API key for current ORG, with Role - Admin`);
    const grafanaApiKey = `/api/auth/keys`;
    try {
      const response = await axios({
        method: 'POST',
        baseURL: GRAFANA_ADMIN_AUTH_URL,
        url: grafanaApiKey,
        headers: {
          Accept: 'application/json'
        },
        data: {
          name: `apikeycurl-${new Date().toISOString().replaceAll(/[-:.TZ]/g, '')}`,
          role: "Admin",
          secondsToLive: 86400
        }
      });

      console.log(`API Key - ${JSON.stringify(response?.data)}`);
      return response?.data?.key ?? null;
    } catch (error) {
      logger.info(`Failed to get new API Key for current ORG, with Role - Admin`);
      return;
    }
  }
}

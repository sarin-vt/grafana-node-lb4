import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {GRAFANA_ADMIN_AUTH_URL} from '../constants';
import logger from '../helpers/logger';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaOrgAdminService {
  constructor() { }

  private async _deleteGrafanaOrg(grafanaOrgId: string): Promise<boolean> {
    logger.info(`Delete the grafana org, with grafanaOrgId - '${grafanaOrgId}'.`);
    const deleteGrafanaOrgApi = `/api/orgs/${grafanaOrgId}}`;
    try {
      const response = await axios({
        method: 'delete',
        baseURL: GRAFANA_ADMIN_AUTH_URL,
        url: deleteGrafanaOrgApi,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response?.status == 200) {
        logger.info(`Grafana ORG with grafanaOrgId - '${grafanaOrgId} is deleted.`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error while getting the grafana orgs list.`, error);
      return false;
    }
  }

  /**
   * Anchor orgId will be the name of the grafana org.
   **/
  private async _checkGrafanaOrgExists(anchorOrgId: string): Promise<string | undefined> {
    logger.info(`Searching grafana ORGs list by name - '${anchorOrgId}'.`);
    const grafanaFindOrgbyName = `/api/orgs/name/${encodeURIComponent(anchorOrgId)}`;
    try {
      const response = await axios({
        method: 'get',
        baseURL: GRAFANA_ADMIN_AUTH_URL,
        url: grafanaFindOrgbyName,
        headers: {
          Accept: 'application/json'
        }
      });

      return response?.data?.orgId;
    } catch (error) {
      logger.error(`Error while getting the grafana orgs list.`, error);
      return;
    }
  }

  public createGrafanaOrg = async (anchorOrgId: string): Promise<string | undefined> => {
    // check if org exists.
    const grafanaOrgId = await this._checkGrafanaOrgExists(anchorOrgId);

    // delete the org, if it already exists.
    if (grafanaOrgId) {
      await this._deleteGrafanaOrg(grafanaOrgId);
    }

    // create new org using the orgId.
    logger.info(`Creating new grafana ORG for AnchorOrgId - '${anchorOrgId}'.`);
    const grafanaCreateOrgApi = `/api/orgs`;
    try {
      const response = await axios({
        method: 'post',
        baseURL: GRAFANA_ADMIN_AUTH_URL,
        url: grafanaCreateOrgApi,
        data: {
          name: anchorOrgId
        },
        headers: {
          Accept: 'application/json'
        }
      });

      return response?.data?.orgId;
    } catch (error) {
      logger.error(`Creating the grafana ORG failed for '${anchorOrgId}'.`, error);
      return;
    }
  }

  public switchGrafanaOrg = async (grafanaOrgId: string): Promise<boolean> => {
    logger.info(`Switching the grafana ORG to '${grafanaOrgId}'.`);
    const grafanaSwitchOrgApiEndpoint = `/api/user/using/${grafanaOrgId}`;
    try {
      const response = await axios({
        method: 'post',
        baseURL: GRAFANA_ADMIN_AUTH_URL,
        url: grafanaSwitchOrgApiEndpoint,
        headers: {
          Accept: 'application/json'
        }
      });

      const orgSwitched = response?.status === 200;
      return orgSwitched ?? false;
    } catch (error) {
      logger.error(`Switching the grafana ORG to '${grafanaOrgId}' failed.`, error);
      throw error;
    }
  }
}

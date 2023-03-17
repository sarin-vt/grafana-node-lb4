import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {isEmpty} from 'lodash';
import path from 'path';
import {GRAFANA_ADMIN_AUTH_URL, GRAFANA_AUTH_TOKEN, TOKEN_AUTH_URL} from '../constants';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaOrgAdminService {
  constructor() { }

  public async deleteGrafanaOrg(grafanaOrgId: string): Promise<boolean> {
    console.log(`Delete the grafana org, with grafanaOrgId - '${grafanaOrgId}'.`);
    const deleteGrafanaOrgApi = `/api/orgs/${grafanaOrgId}`;
    try {
      const response = await axios({
        method: 'DELETE',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, deleteGrafanaOrgApi)
      });

      if (response?.status == 200) {
        console.log(`Grafana ORG with grafanaOrgId - '${grafanaOrgId} is deleted.`);
        return true;
      }

      return false;
    } catch (error) {
      console.log(`Error while deleting grafana org with Id - ${grafanaOrgId}.`, error);
      return false;
    }
  }

  /**
   * Anchor orgId will be the name of the grafana org.
   **/
  public async checkGrafanaOrgExists(anchorOrgId: string): Promise<string | undefined> {
    console.log(`Searching grafana ORGs list by name - '${anchorOrgId}'.`);
    const grafanaFindOrgbyName = `/api/orgs/name/${encodeURIComponent(anchorOrgId)}`;
    try {
      const response = await axios({
        method: 'GET',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, grafanaFindOrgbyName)
      });

      console.log(response.data);

      const grafanaOrgId = response?.data?.id?.toString() ?? "";

      if (isEmpty(grafanaOrgId)) {
        return;
      }
      console.log(`Found grafana ORG  with name, Id - '${anchorOrgId}, ${grafanaOrgId}'`);
      return grafanaOrgId;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  public getCurrentOrg = async (authKey: string): Promise<void> => {
    const response = await axios({
      method: 'GET',
      url: path.join(GRAFANA_ADMIN_AUTH_URL, '/api/org/')
    });

    console.log(`current org admin auth - ${JSON.stringify(response?.data)}`);

    const responsetoken = await axios({
      method: 'GET',
      url: path.join(TOKEN_AUTH_URL, '/api/org/'),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${GRAFANA_AUTH_TOKEN}`
      }
    });
    console.log(`current org token auth - ${JSON.stringify(responsetoken?.data)}`);
  }

  public createGrafanaOrg = async (anchorOrgId: string): Promise<string | undefined> => {
    // check if org exists.
    const grafanaOrgId = (await this.checkGrafanaOrgExists(anchorOrgId))?.toString() ?? "";

    console.log(`grafana log after checking is org exists - ${grafanaOrgId}`);
    // delete the org, if it already exists.
    if (!isEmpty(grafanaOrgId)) {
      console.log(`calling grafana org delete for - ${grafanaOrgId}`);
      await this.deleteGrafanaOrg(grafanaOrgId);
    }

    // create new org using the orgId.
    console.log(`Creating new grafana ORG for AnchorOrgId - '${anchorOrgId}'.`);
    const grafanaCreateOrgApi = `/api/orgs`;
    try {
      const response = await axios({
        method: 'post',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, grafanaCreateOrgApi),
        data: {
          name: anchorOrgId
        },
        headers: {
          Accept: 'application/json'
        }
      });

      const newGrafanaOrgId = response?.data?.orgId ?? "";
      return newGrafanaOrgId;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  public switchGrafanaOrg = async (grafanaOrgId: string): Promise<boolean> => {
    console.log(`Switching the grafana ORG to '${grafanaOrgId}'.`);
    const grafanaSwitchOrgApiEndpoint = `/api/user/using/${grafanaOrgId}`;
    try {
      const response = await axios({
        method: 'POST',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, grafanaSwitchOrgApiEndpoint)
      });

      const orgSwitched = response?.status === 200;
      return orgSwitched ?? false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

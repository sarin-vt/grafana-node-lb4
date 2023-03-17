import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {isEmpty} from 'lodash';
import path from 'path';
import {GRAFANA_ADMIN_AUTH_URL, GRAFANA_AUTH_TOKEN, TOKEN_AUTH_URL} from '../constants';
import logger from '../helpers/logger';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaUserService {
  constructor() { }

  public async checkGrafanaUserExists(adminEmail: string): Promise<string | undefined> {
    console.log(`Searching grafana users list by email - '${adminEmail}'.`);
    const grafanaFindUserByEmail = `/api/users/lookup?loginOrEmail=${adminEmail}`;
    try {
      const response = await axios({
        method: 'GET',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, grafanaFindUserByEmail),
      });

      console.log(response?.data);
      return response?.data?.id ?? "";
    } catch (error) {
      console.log(`Error while searching for the grafana users list.`, error);
      return "";
    }
  }

  public async deleteGrafanaUser(userId: string): Promise<boolean | undefined> {
    logger.info(`Deleting grafana user by Id - '${userId}'.`);
    const deleteUserById = `/api/admin/users/${userId}`;
    try {
      const response = await axios({
        method: 'DELETE',
        url: path.join(GRAFANA_ADMIN_AUTH_URL, deleteUserById)
      });

      if (response?.status == 200) {
        console.log(`Grafana user with userId - '${userId} is deleted.`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error while deleting the grafana user.`, error);
      return false;
    }
  }

  public createGrafanaOrgAdminUser = async (anchorOrgId: string, adminEmail: string, authToken: string): Promise<boolean | undefined> => {
    const grafanUserId = (await this.checkGrafanaUserExists(adminEmail))?.toString();

    console.log(`grafana userId - ${grafanUserId}`);
    if (!isEmpty(grafanUserId)) {
      await this.deleteGrafanaUser(grafanUserId ?? "");
    }

    logger.info(`Inviting new grafana user - ${adminEmail}, to join org - ${anchorOrgId} with role - Admin`);
    const grafanaAdminUserInviteApi = `/api/org/invites`;
    try {
      const response = await axios({
        method: 'POST',
        baseURL: TOKEN_AUTH_URL,
        url: grafanaAdminUserInviteApi,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${GRAFANA_AUTH_TOKEN}`
        },
        data: {
          name: "",
          email: adminEmail,
          role: "Admin",
          sendEmail: true,
          loginOrEmail: adminEmail,
          OrgId: 28
        }
      });
      console.log(`user invite response ${JSON.stringify(response?.data)}`);
      return true;
    } catch (error) {
      logger.info(`Failed to Invite the user - (${adminEmail}, to the Org ${anchorOrgId}), with Role - Admin`);
      console.log(error);
      return false;
    }
  }
}

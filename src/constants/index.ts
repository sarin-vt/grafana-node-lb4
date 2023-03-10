import dotenv from 'dotenv';
import NodeEnvironment from '../types/node-environment';

dotenv.config();

const GRAFANA_ADMIN_AUTH_URL = process.env.GRAFANA_ADMIN_AUTH_URL! ?? 'https://admin:VCe3xhYk@prod.grafana.datanchor.io';

const NODE_ENV = process.env.NODE_ENV! ?? NodeEnvironment.DEVELOPMENT;

export {
  NODE_ENV,
  GRAFANA_ADMIN_AUTH_URL
};


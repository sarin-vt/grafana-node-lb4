import dotenv from 'dotenv';
import NodeEnvironment from '../types/node-environment';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV! ?? NodeEnvironment.DEVELOPMENT;
const INFLUX_ENDPOINT = process.env.INFLUX_ENDPOINT ?? "https://us-central1-1.gcp.cloud2.influxdata.com/";
const INFLUX_TOKEN = process.env.INFLUX_TOKEN ?? "gBIY68pzsEsXOFwhRfs3nQnZCPAmtmesAKnsyCLqx6iudPsstqTLbW0y5AqqSpjB5zPzHn41_nwl3kROMasBCQ==";
const TOKEN_AUTH_URL = process.env.TOKEN_AUTH_URL ?? "https://beta.grafana.datanchor.io";
const GRAFANA_ADMIN_AUTH_URL = process.env.ADMIN_AUTH_URL ?? `https://admin:AnchorBetaAdmin@beta.grafana.datanchor.io/`;
const GRAFANA_AUTH_TOKEN = process.env.GRAFANA_AUTH_TOKEN ?? `glsa_BlIswqI75yFzWGz1y3OSOI4SmUISywWf_8f21a2da`;

export {
  NODE_ENV,
  GRAFANA_ADMIN_AUTH_URL,
  INFLUX_ENDPOINT,
  INFLUX_TOKEN,
  TOKEN_AUTH_URL,
  GRAFANA_AUTH_TOKEN
};


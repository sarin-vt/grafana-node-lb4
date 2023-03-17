import dotenv from 'dotenv';
import NodeEnvironment from '../types/node-environment';

dotenv.config();

const GRAFANA_ADMIN_AUTH_URL = process.env.GRAFANA_ADMIN_AUTH_URL! ?? 'https://admin:VCe3xhYk@prod.grafana.datanchor.io';

const NODE_ENV = process.env.NODE_ENV! ?? NodeEnvironment.DEVELOPMENT;
const INFLUX_ENDPOINT = process.env.INFLUX_ENDPOINT ?? "https://us-central1-1.gcp.cloud2.influxdata.com/";
const INFLUX_TOKEN = process.env.INFLUX_TOKEN ?? "gBIY68pzsEsXOFwhRfs3nQnZCPAmtmesAKnsyCLqx6iudPsstqTLbW0y5AqqSpjB5zPzHn41_nwl3kROMasBCQ==";
const TOKEN_AUTH_URL = process.env.TOKEN_AUTH_URL ?? "https://beta.grafana.datanchor.io";
const ADMIN_AUTH_URL = process.env.ADMIN_AUTH_URL ?? `https://sarin@datanchor.io:VCe3xhYk@beta.grafana.datanchor.io`;
const GRAFANA_AUTH_TOKEN = process.env.GRAFANA_AUTH_TOKEN ?? `glsa_esIaIbQqnSt3ZX1A5iPo4lc5xYFT32lL_fdc62638`;

export {
  NODE_ENV,
  GRAFANA_ADMIN_AUTH_URL,
  INFLUX_ENDPOINT,
  INFLUX_TOKEN,
  TOKEN_AUTH_URL,
  ADMIN_AUTH_URL,
  GRAFANA_AUTH_TOKEN
};


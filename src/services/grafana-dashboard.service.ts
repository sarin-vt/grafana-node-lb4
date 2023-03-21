import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {TOKEN_AUTH_URL} from '../constants';


@injectable({scope: BindingScope.REQUEST})
export class GrafanaDashboardService {
  constructor() { }
  public createNewGrafanaDashboard = async (anchorOrgId: string, adminAuthKey: string) => {
    const influxCreateDashboardApi = "/api/dashboards/db";
    const datasource = `${anchorOrgId}-influx-cloud`;
    console.log(`\t Creating new dashboard for current ORG`);
    try {
      const response = await axios({
        method: 'post',
        baseURL: TOKEN_AUTH_URL,
        url: influxCreateDashboardApi,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminAuthKey}`
        },
        data: {
          "dashboard": {
            "id": null,
            "uid": null,
            "title": `${anchorOrgId}`,
            "tags": [],
            "timezone": "browser",
            "schemaVersion": 16,
            "version": 0,
            "refresh": "25s",
            "panels": [
              {
                "circleMaxSize": "10",
                "circleMinSize": "1",
                "colors": [
                  "rgba(245, 54, 54, 0.9)",
                  "rgba(237, 129, 40, 0.89)",
                  "rgba(50, 172, 45, 0.97)"
                ],
                "datasource": `${datasource}`,
                "decimals": 0,
                "description": "",
                "esLocationName": "geohash",
                "esMetric": "count",
                "fieldConfig": {
                  "defaults": {
                    "custom": {
                      "align": null,
                      "filterable": false
                    },
                    "mappings": [],
                    "thresholds": {
                      "mode": "absolute",
                      "steps": [
                        {
                          "color": "green",
                          "value": null
                        },
                        {
                          "color": "red",
                          "value": 80
                        }
                      ]
                    }
                  },
                  "overrides": []
                },
                "gridPos": {
                  "h": 9,
                  "w": 12,
                  "x": 0,
                  "y": 0
                },
                "hideEmpty": false,
                "hideZero": false,
                "id": 10,
                "initialZoom": "3",
                "interval": "",
                "links": [],
                "locationData": "table",
                "mapCenter": "North America",
                "mapCenterLatitude": 40,
                "mapCenterLongitude": -100,
                "maxDataPoints": 100,
                "mouseWheelZoom": false,
                "pluginVersion": "7.3.6",
                "showLegend": false,
                "stickyLabels": false,
                "tableQueryOptions": {
                  "geohashField": "geohash",
                  "labelField": "userId",
                  "latitudeField": "latitude",
                  "longitudeField": "longitude",
                  "metricField": "count",
                  "queryType": "geohash"
                },
                "targets": [
                  {
                    "groupBy": [
                      {
                        "params": ["geohash"],
                        "type": "tag"
                      },
                      {
                        "params": ["userName"],
                        "type": "tag"
                      }
                    ],
                    "measurement": "fileAccess",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "query": "from(bucket: v.bucket)\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r._measurement == \"fileAccess\" and r._field == \"geohash\")\n  |> keep(columns: [\"geohash\", \"userId\", \"_value\"])\n  |> group(columns: [\"geohash\", \"userId\"])\n  |> count()\n  |> rename(columns: {_value: \"count\"})\n  |> group()",
                    "refId": "A",
                    "resultFormat": "table",
                    "select": [
                      [
                        {
                          "params": ["fileId"],
                          "type": "field"
                        },
                        {
                          "params": [],
                          "type": "count"
                        },
                        {
                          "params": ["metric"],
                          "type": "alias"
                        }
                      ]
                    ],
                    "tags": []
                  }
                ],
                "thresholds": "10,400",
                "timeFrom": null,
                "timeShift": null,
                "title": "File Access / Location",
                "type": "grafana-worldmap-panel",
                "unitPlural": "files",
                "unitSingle": "",
                "unitSingular": "file",
                "valueName": "total"
              },
              {
                "aliasColors": {},
                "bars": false,
                "cacheTimeout": null,
                "dashLength": 10,
                "dashes": false,
                "datasource": `${datasource}`,
                "fieldConfig": {
                  "defaults": {
                    "custom": {},
                    "mappings": [],
                    "thresholds": {
                      "mode": "absolute",
                      "steps": [
                        {
                          "color": "green",
                          "value": null
                        },
                        {
                          "color": "red",
                          "value": 80
                        }
                      ]
                    }
                  },
                  "overrides": []
                },
                "fill": 10,
                "fillGradient": 1,
                "gridPos": {
                  "h": 9,
                  "w": 12,
                  "x": 12,
                  "y": 0
                },
                "hiddenSeries": false,
                "id": 2,
                "interval": "",
                "legend": {
                  "alignAsTable": false,
                  "avg": "false",
                  "current": "false",
                  "max": "false",
                  "min": "false",
                  "rightSide": false,
                  "show": false,
                  "total": "false",
                  "values": "false"
                },
                "lines": true,
                "linewidth": 5,
                "links": [],
                "nullPointMode": "null",
                "options": {
                  "alertThreshold": true
                },
                "percentage": false,
                "pluginVersion": "7.3.6",
                "pointradius": 4,
                "points": false,
                "renderer": "flot",
                "repeat": "null",
                "seriesOverrides": [],
                "spaceLength": 10,
                "stack": false,
                "steppedLine": false,
                "targets": [
                  {
                    "alias": "",
                    "groupBy": [
                      {
                        "params": ["10s"],
                        "type": "time"
                      }
                    ],
                    "measurement": "fileAccess",
                    "orderByTime": "ASC",
                    "policy": "autogen",
                    "query": "from(bucket: v.bucket)\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n    |> filter(fn: (r) => r._field == \"fileId\")\n    |> window(every: 10m)\n    |> count()",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                      [
                        {
                          "params": ["fileId"],
                          "type": "field"
                        },
                        {
                          "params": [],
                          "type": "count"
                        }
                      ]
                    ],
                    "tags": []
                  }
                ],
                "thresholds": [],
                "timeFrom": null,
                "timeRegions": [],
                "timeShift": null,
                "title": "File Access Over Time",
                "tooltip": {
                  "shared": false,
                  "sort": 0,
                  "value_type": "individual"
                },
                "type": "graph",
                "xaxis": {
                  "buckets": "null",
                  "mode": "time",
                  "name": "null",
                  "show": "true",
                  "values": []
                },
                "yaxes": [
                  {
                    "format": "short",
                    "label": "",
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                  },
                  {
                    "format": "short",
                    "label": "",
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                  }
                ],
                "yaxis": {
                  "align": "false",
                  "alignLevel": "null"
                }
              },
              {
                "aliasColors": {},
                "breakPoint": "75%",
                "cacheTimeout": "null",
                "combine": {
                  "label": "Others",
                  "threshold": 0
                },
                "datasource": `${datasource}`,
                "decimals": null,
                "fieldConfig": {
                  "defaults": {
                    "custom": {
                      "align": null,
                      "filterable": false
                    },
                    "mappings": [],
                    "thresholds": {
                      "mode": "absolute",
                      "steps": [
                        {
                          "color": "green",
                          "value": null
                        },
                        {
                          "color": "red",
                          "value": 80
                        }
                      ]
                    }
                  },
                  "overrides": []
                },
                "fontSize": "80%",
                "format": "short",
                "gridPos": {
                  "h": 9,
                  "w": 12,
                  "x": 0,
                  "y": 9
                },
                "id": 12,
                "interval": "1m",
                "legend": {
                  "header": "Count",
                  "percentage": true,
                  "show": true,
                  "values": true
                },
                "legendType": "Under graph",
                "links": [],
                "maxDataPoints": 3,
                "nullPointMode": "connected",
                "pieType": "pie",
                "pluginVersion": "7.3.6",
                "strokeWidth": 1,
                "targets": [
                  {
                    "alias": "$tag_userName",
                    "groupBy": [
                      {
                        "params": ["10s"],
                        "type": "time"
                      },
                      {
                        "params": ["userName"],
                        "type": "tag"
                      }
                    ],
                    "hide": false,
                    "measurement": "fileAccess",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "query": "from(bucket: v.bucket)\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n    |> filter(fn: (r) => r._field == \"fileId\")\n    |> group(columns: [\"userName\"], mode:\"by\")  \n    |> count()",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                      [
                        {
                          "params": ["fileId"],
                          "type": "field"
                        },
                        {
                          "params": [],
                          "type": "count"
                        }
                      ]
                    ],
                    "tags": []
                  }
                ],
                "timeFrom": null,
                "timeShift": null,
                "title": "File Accesses / User Name",
                "transformations": [],
                "type": "grafana-piechart-panel",
                "valueName": "current"
              },
              {
                "aliasColors": {},
                "breakPoint": "75%",
                "cacheTimeout": "null",
                "combine": {
                  "label": "Others",
                  "threshold": 0
                },
                "datasource": `${datasource}`,
                "decimals": null,
                "fieldConfig": {
                  "defaults": {
                    "custom": {}
                  },
                  "overrides": []
                },
                "fontSize": "80%",
                "format": "short",
                "gridPos": {
                  "h": 9,
                  "w": 12,
                  "x": 12,
                  "y": 9
                },
                "id": 4,
                "interval": "",
                "legend": {
                  "header": "Count",
                  "percentage": true,
                  "show": true,
                  "values": true
                },
                "legendType": "Under graph",
                "links": [],
                "nullPointMode": "connected",
                "pieType": "pie",
                "strokeWidth": 1,
                "targets": [
                  {
                    "alias": "$tag_action",
                    "groupBy": [
                      {
                        "params": ["10s"],
                        "type": "time"
                      },
                      {
                        "params": ["action"],
                        "type": "tag"
                      }
                    ],
                    "measurement": "fileAccess",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "query": "from(bucket: v.bucket)\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n    |> filter(fn: (r) => r._field == \"fileId\")\n    |> group(columns: [\"action\"], mode:\"by\")  \n    |> count()",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                      [
                        {
                          "params": ["fileId"],
                          "type": "field"
                        },
                        {
                          "params": [],
                          "type": "count"
                        }
                      ]
                    ],
                    "tags": []
                  }
                ],
                "title": "File Accesses / Action",
                "type": "grafana-piechart-panel",
                "valueName": "total"
              },
              {
                "aliasColors": {},
                "breakPoint": "75%",
                "cacheTimeout": "null",
                "combine": {
                  "label": "Others",
                  "threshold": 0
                },
                "datasource": `${datasource}`,
                "decimals": null,
                "fieldConfig": {
                  "defaults": {
                    "custom": {}
                  },
                  "overrides": []
                },
                "fontSize": "80%",
                "format": "short",
                "gridPos": {
                  "h": 9,
                  "w": 12,
                  "x": 6,
                  "y": 18
                },
                "id": 6,
                "interval": "",
                "legend": {
                  "header": "Count",
                  "percentage": true,
                  "show": true,
                  "values": true
                },
                "legendType": "Under graph",
                "links": [],
                "nullPointMode": "connected",
                "pieType": "pie",
                "strokeWidth": 1,
                "targets": [
                  {
                    "alias": "$tag_appName",
                    "groupBy": [
                      {
                        "params": ["10s"],
                        "type": "time"
                      },
                      {
                        "params": ["appName"],
                        "type": "tag"
                      }
                    ],
                    "measurement": "fileAccess",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "query": "from(bucket: v.bucket)\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n    |> filter(fn: (r) => r._field == \"fileId\")\n    |> group(columns: [\"appName\"])\n    |> count()",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                      [
                        {
                          "params": ["fileId"],
                          "type": "field"
                        },
                        {
                          "params": [],
                          "type": "count"
                        }
                      ]
                    ],
                    "tags": []
                  }
                ],
                "title": "File Accesses / Application Name",
                "type": "grafana-piechart-panel",
                "valueName": "total"
              }
            ],
          },
          "folderId": 0,
          "message": "",
          "overwrite": true
        }
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }

}

const axios = require("axios");
const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config();


function roundNumber(num) {
    const rounded = Math.round(num * 100) / 100;
    return Number(rounded.toFixed(2));
}

async function getMinerInfo(minerIpAddress) {
    try {
        const url = `http://${minerIpAddress}/api/system/info`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching ASIC info:', err.message);
        return null;
    }
}

async function getMinerAsic(minerIpAddress) {
    try {
        const url = `http://${minerIpAddress}/api/system/asic`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error fetching ASIC info:', err.message);
        return null;
    }
}

const url = process.env.DB_URL;
const token = process.env.DB_TOKEN;
const org = process.env.DB_ORG;
const bucket = process.env.DB_BUCKET;

const influxDB = new InfluxDB({ url, token });
async function getData(value) {
    let range = '-1y';
    try {
        const queryApi = influxDB.getQueryApi(org);

        const fluxQuery = `
      from(bucket: "${bucket}")
      |> range(start: ${range})
      |> filter(fn: (r) => r._measurement == "device_metrics" and r._field == "${value}")
    `;

        const results = {}; // { timestamp: value }

        await new Promise((resolve, reject) => {
            queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    results[o._time] = o._value;
                },
                error(error) {
                    console.error('Query error:', error);
                    reject(error);
                },
                complete() {
                    resolve();
                },
            });
        });
        console.log('Data retrieved successfully:', results);
        return results;

    } catch (err) {
        console.error('Failed to get data:', err);
        return null;
    }
}

// Exporting functions for use in other modules
module.exports = {
    roundNumber,
    getMinerInfo,
    getMinerAsic,
    getData
};
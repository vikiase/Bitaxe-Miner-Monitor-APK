const express = require('express');
const utils = require('./utils');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
require('dotenv').config();


const app = express();
app.use(express.json());

const org = process.env.DB_ORG;
const bucket = process.env.DB_BUCKET
const token = process.env.DB_TOKEN;
const client = new InfluxDB({ url: process.env.DB_URL, token })


let minerIpAddress = process.env.MINER_IP_ADDRESS;

async function getMinerData(minerIpAddress) {
    try {
        const data = await utils.getMinerInfo(minerIpAddress);
        return {
        'hashrate': utils.roundNumber(data.hashRate),
        'power': utils.roundNumber(data.power),
        'coreVoltageActual': data.coreVoltageActual,
        'fanRPM': data.fanrpm,
        'temperature': utils.roundNumber(data.temp),
    };

    } catch (error) {
        console.error('Error fetching miner data:', error.message);
        return null;
    }
}

async function saveData(data) {
    try {
        const point = new Point('device_metrics')
            .floatField('hashrate', data.hashrate)
            .floatField('power', data.power)
            .floatField('coreVoltageActual', data.coreVoltageActual)
            .intField('fanRPM', data.fanRPM)
            .floatField('temperature', data.temperature)

        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({ host: 'pi3' })
        writeApi.writePoint(point)
        writeApi
            .close()
            .then(() => console.log('Successfully wrote data to InfluxDB'))
            .catch(e => console.error('Error writing:', e))
        console.log('Data saved:', data);
    } catch (error) {
        console.error('Error logging data:', error.message);
    }
}

async function startLogging() {
    while (true) {
        const data = await getMinerData(minerIpAddress);
        if (data) {
            await saveData(data);
        }
        await new Promise(resolve => setTimeout(resolve, 30 * 1000)); // čekej 30s
    }
}

startLogging();
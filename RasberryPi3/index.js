const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
const axios = require('axios');
const utils = require('./utils');
require('dotenv').config();


const { spawn } = require('child_process');
let loggingProcess = null;

let minerIpAddress = process.env.MINER_IP_ADDRESS;

app.get('/', (req, res) => {
    res.send(true);
});

app.post('/start-log', (req, res) => {
    if (loggingProcess) {
        return res.status(400).json({ error: 'Logging script already running' });
    }

    try {
        loggingProcess = spawn('node', ['loggingScript.js'], {
            stdio: 'inherit',
        });

        loggingProcess.on('exit', (code, signal) => {
            console.log(`Logging script exited with code ${code}, signal ${signal}`);
            loggingProcess = null;
        });

        console.log('Logging script started');
        res.json({ message: 'Logging script started successfully' });
    } catch (err) {
        console.error('Error starting logging script:', err.message);
        res.status(500).json({ error: 'Failed to start logging script' });
    }
});

app.post('/end-log', (req, res) => {
    if (!loggingProcess) {
        return res.status(400).json({ error: 'Logging script is not running' });
    }

    try {
        loggingProcess.kill('SIGTERM');
        console.log('Logging script stopped');
        res.json({ message: 'Logging script stopped successfully' });
    } catch (err) {
        console.error('Error stopping logging script:', err.message);
        res.status(500).json({ error: 'Failed to stop logging script' });
    }
});


app.get('/info', async (req, res) => {
    try {
        const data = await utils.getMinerInfo(minerIpAddress);
        const response = {
            'power': utils.roundNumber(data.power),
            'voltage': utils.roundNumber(Number(data.voltage)/1000),
            'temperature': utils.roundNumber(data.temp),
            'vrTemperature': utils.roundNumber(data.vrTemp),
            'hashrate': utils.roundNumber(data.hashRate),
            'bestDiff': data.bestDiff,
            'bestSessionDiff': data.bestSessionDiff,
            'isUsingFallbackStratum': data.isUsingFallbackStratum,
            'freeRAM': data.freeHeap,
            'coreVoltage': data.coreVoltage,
            'coreVoltageActual': data.coreVoltageActual,
            'coreFrequency': data.coreFrequency,
            'ssid': data.ssid,
            'hostname': data.hostname,
            'wifiStatus': data.wifiStatus,
            'sharesAccepted': data.sharesAccepted,
            'sharesRejected': data.sharesRejected,
            'sharesRejectedReasons': data.sharesRejectedReasons,
            'uptimeSeconds': data.uptimeSeconds,
            'asicCount': data.asicCount,
            'smallCoreCount': data.smallCoreCount,
            'ASICModel': data.ASICModel,
            'stratumURL': data.stratumURL,
            'fallbackStratumURL': data.fallbackStratumURL,
            'stratumPort': data.stratumPort,
            'fallbackStratumPort': data.fallbackStratumPort,
            'stratumUser': data.stratumUser,
            'fallbackStratumUser': data.fallbackStratumUser,
            'version': data.version, //firmware version
            'flipScreen': data.flipScreen,
            'overheat_mode': data.overheat_mode,
            'overclockEnabled': data.overclockEnabled,
            'invertScreen': data.invertscreen,
            'displayTimeout': data.displayTimeout,
            'autoFanSpeed': data.autofanspeed,
            'fanSpeed': data.fanspeed,
            'tempTarget': data.temptarget,
            'fanRPM': data.fanrpm
        };
        res.json(response);
        }
    catch (err) {
        console.error('Error fetching miner info:', err.message);
        res.status(500).json({ error: 'Failed to fetch miner info' });
    }
});

app.get('/asic-options', async (req, res) => {
    try {
        const data = await utils.getMinerAsic(minerIpAddress);
        if (data) {
            const response = {
                'frequencyOptions': data.frequencyOptions,
                'voltageOptions': data.voltageOptions,
            }
            res.json(response);
        } else {
            res.status(404).json({ error: 'ASIC options not found' });
        }
    }
    catch (err) {
        console.error('Error fetching ASIC options:', err.message);
        res.status(500).json({ error: 'Failed to fetch ASIC options' });
    }
});

app.get('/graph-data-year', async (req, res) => {
    try {
        hashrateData = await utils.getData('hashrate');
        powerData = await utils.getData('power');
        coreVoltageActualData = await utils.getData('coreVoltageActual');
        fanRPMData = await utils.getData('fanRPM');
        temperatureData = await utils.getData('temperature');
        const response = {
            hashrate: hashrateData,
            power: powerData,
            coreVoltageActual: coreVoltageActualData,
            fanRPM: fanRPMData,
            temperature: temperatureData
        };
        res.json(response);
    }
    catch (err) {
        console.error('Error fetching graph data:', err.message);
        res.status(500).json({ error: 'Failed to fetch graph data' });
    }

});

app.post('/restart', async (req, res) => {
    try {
        const response = await axios.post(`http://${minerIpAddress}/api/system/restart`);
        res.json({ message: 'Bitaxe restart requested', response: response.data });
    } catch (err) {
        console.error('Restart failed:', err.message);
        res.status(500).json({ error: 'Failed to restart Bitaxe' });
    }
});

app.patch('/patch-miner', async (req, res) => {
    const { coreVoltage, frequency } = req.body;

    const body = {};
    if (coreVoltage !== undefined && coreVoltage !== '') body.coreVoltage = String(coreVoltage);
    if (frequency !== undefined && frequency !== '') body.frequency = String(frequency);

    if (Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'No valid parameters provided' });
    }

    try {
        const response = await axios.patch(
            `http://${minerIpAddress}/api/system`,
            body,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        res.json({ message: 'ASIC settings updated', response: response.data });
    } catch (err) {
        console.error('Failed to update ASIC settings:', err.message);
        res.status(500).json({ error: 'Failed to update ASIC settings' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
const axios = require('axios');
const utils = require('./utils');


let minerIpAddress = '---'; // Replace with your miner's IP address

app.get('/', (req, res) => {
    res.send(true);
});

app.get('/info', async (req, res) => {
    try {
        const data = await utils.getMinerInfo(minerIpAddress);
        const response = {
            'power': utils.roundNumber(data.power),
            'voltage': utils.roundNumber(Number(data.voltage)/1000),
            'temperature': utils.roundNumber(data.temp),
            'vrTemperature': utils.roundNumber(data.vrTemp),
            'hashrate': utils.roundNumber(data.hashrate),
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

app.post('/restart', async (req, res) => {
    try {
        const response = await axios.post(`http://${minerIpAddress}/api/system/restart`);
        res.json({ message: 'Bitaxe restart requested', response: response.data });
    } catch (err) {
        console.error('Restart failed:', err.message);
        res.status(500).json({ error: 'Failed to restart Bitaxe' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



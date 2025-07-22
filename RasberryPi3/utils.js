const axios = require("axios");

function roundNumber(num) {
    const rounded = Math.round(num * 100) / 100;
    return Number(rounded.toFixed(2));
}

async function getMinerInfo(minerIpAddress) {
    try {
        const url = `http://${minerIpAddress}/api/system/info`;
        const response = await axios.get(url);
        const data = response.data;

        console.log(data);

        return data;
    } catch (err) {
        console.error('Error fetching ASIC info:', err.message);
        return null;
    }
}

async function getMinerAsic(minerIpAddress) {
    try {
        const url = `http://${minerIpAddress}/api/system/asic`;
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (err) {
        console.error('Error fetching ASIC info:', err.message);
        return null;
    }
}


module.exports = {
    roundNumber,
    getMinerInfo,
    getMinerAsic
};

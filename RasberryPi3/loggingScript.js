const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
const axios = require('axios');
const utils = require('./utils');


let minerIpAddress = '---'; // Replace with your miner's IP address
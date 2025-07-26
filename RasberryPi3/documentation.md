# Project Documentation

## Overview

This project is a Node.js-based application designed to monitor and manage a Bitaxe Gamma Miner. It provides an API for interacting with the miner, logging its metrics to an InfluxDB database, and retrieving historical data for analysis. It should be ran on a computer (f.e. Raspberry Pi3) connected to the same network as your miner.

---


## Workflow

1. **API Server**: 
   - The main server (`index.js`) provides RESTful endpoints for interacting with the miner and managing logging operations.
   - It communicates with the miner's API to fetch real-time data and control its settings.

2. **Logging Script**:
   - A separate script (`loggingScript.js`) runs in the background to periodically fetch miner metrics and store them in InfluxDB.

3. **Utilities**:
   - The `utils.js` file contains helper functions for interacting with the miner's API and querying InfluxDB.

4. **Database**:
   - Metrics such as hashrate, power, temperature, and fan speed are logged to InfluxDB for long-term storage and analysis.

---

## Functions

### `index.js`

1. **Endpoints**:
   - `GET /`: Health check endpoint.
   - `POST /start-log`: Starts the logging script in a separate process.
   - `POST /end-log`: Stops the logging script.
   - `GET /info`: Fetches real-time miner information.
   - `GET /asic-options`: Retrieves ASIC configuration options.
   - `GET /graph-data-year`: Fetches historical data for metrics over the past year.
   - `POST /restart`: Sends a restart command to the miner.
   - `PATCH /patch-miner`: Updates miner settings (e.g., core voltage, frequency).

2. **Process Management**:
   - Uses `child_process.spawn` to start and stop the logging script.

---

### `loggingScript.js`

1. **Data Logging**:
   - Periodically fetches miner metrics using `utils.getMinerInfo`.
   - Saves the metrics to InfluxDB using the InfluxDB client.

2. **Infinite Loop**:
   - Runs an infinite loop with a 30-second delay between data fetches.
   - It is ran or stopped by `POST /start-log` and `POST /end-log` endpoints.

---

### `utils.js`

1. **Helper Functions**:
   - `roundNumber(num)`: Rounds a number to two decimal places.
   - `getMinerInfo(minerIpAddress)`: Fetches real-time miner information from the miner's API.
   - `getMinerAsic(minerIpAddress)`: Retrieves ASIC configuration options from the miner's API.
   - `getData(value)`: Queries historical data for a specific metric from InfluxDB.

2. **Database Interaction**:
   - Uses the InfluxDB client to query and write data.

---

## Environment Variables

The project uses a `.env` file to store sensitive configuration:

- `MINER_IP_ADDRESS`: IP address of the miner.
- `DB_ORG`: Organization name for InfluxDB.
- `DB_BUCKET`: Bucket name for InfluxDB.
- `DB_TOKEN`: Authentication token for InfluxDB.
- `DB_URL`: URL of the InfluxDB instance.

* See yourself how it should look in example.env.

---

## How It Works

1. **Start the Server**:
   - Run the `index.js` file to start the API server.
   - The server listens on port 3000.

2. **Start Logging**:
   - Use the `/start-log` endpoint to start the logging script.
   - The script fetches metrics from the miner and logs them to InfluxDB.

3. **Fetch Data**:
   - Use the `/info` or `/graph-data-year` endpoints to retrieve real-time or historical data.

4. **Manage Miner**:
   - Use the `/restart` or `/patch-miner` endpoints to control the miner's settings.

---

## Notes

- Ensure the `.env` file is properly configured before running the application.
- The miner's API must be accessible from the server's network.
- InfluxDB must be running and reachable at the specified `DB_URL`. You have to set it up - [InfluxData Downloads](https://www.influxdata.com/downloads/), InfluxDB OSS 2.x

\# Project Documentation 



\## Overview

This project is a Node.js-based application designed to monitor and manage a Bitaxe Gamma Miner. It provides an API for interacting with the miner, logging its metrics to an InfluxDB database, and retrieving historical data for analysis. It should be ran on a computer (f.e. Rasberry Pi3) connected to the same network as your miner.



---



\## Tech Stack

\- \*\*Programming Language\*\*: JavaScript

\- \*\*Runtime\*\*: Node.js

\- \*\*Frameworks\*\*: 

&nbsp; - Express.js (for building the REST API)

\- \*\*Database\*\*: InfluxDB (time-series database for storing miner metrics)

\- \*\*HTTP Client\*\*: Axios (for making HTTP requests to the miner)

\- \*\*Environment Variables\*\*: dotenv (for managing sensitive configuration)

\- \*\*Process Management\*\*: Node.js `child\_process` module (for running background scripts)



---



\## Workflow

1\. \*\*API Server\*\*: 

&nbsp;  - The main server (`index.js`) provides RESTful endpoints for interacting with the miner and managing logging operations.

&nbsp;  - It communicates with the miner's API to fetch real-time data and control its settings.



2\. \*\*Logging Script\*\*:

&nbsp;  - A separate script (`loggingScript.js`) runs in the background to periodically fetch miner metrics and store them in InfluxDB.



3\. \*\*Utilities\*\*:

&nbsp;  - The `utils.js` file contains helper functions for interacting with the miner's API and querying InfluxDB.



4\. \*\*Database\*\*:

&nbsp;  - Metrics such as hashrate, power, temperature, and fan speed are logged to InfluxDB for long-term storage and analysis.



---



\## Functions



\### `index.js`

1\. \*\*Endpoints\*\*:

&nbsp;  - `GET /`: Health check endpoint.

&nbsp;  - `POST /start-log`: Starts the logging script in a separate process.

&nbsp;  - `POST /end-log`: Stops the logging script.

&nbsp;  - `GET /info`: Fetches real-time miner information.

&nbsp;  - `GET /asic-options`: Retrieves ASIC configuration options.

&nbsp;  - `GET /graph-data-year`: Fetches historical data for metrics over the past year.

&nbsp;  - `POST /restart`: Sends a restart command to the miner.

&nbsp;  - `PATCH /patch-miner`: Updates miner settings (e.g., core voltage, frequency).



2\. \*\*Process Management\*\*:

&nbsp;  - Uses `child\_process.spawn` to start and stop the logging script.



---



\### `loggingScript.js`

1\. \*\*Data Logging\*\*:

&nbsp;  - Periodically fetches miner metrics using `utils.getMinerInfo`.

&nbsp;  - Saves the metrics to InfluxDB using the InfluxDB client.



2\. \*\*Infinite Loop\*\*:

&nbsp;  - Runs an infinite loop with a 30-second delay between data fetches.



---



\### `utils.js`

1\. \*\*Helper Functions\*\*:

&nbsp;  - `roundNumber(num)`: Rounds a number to two decimal places.

&nbsp;  - `getMinerInfo(minerIpAddress)`: Fetches real-time miner information from the miner's API.

&nbsp;  - `getMinerAsic(minerIpAddress)`: Retrieves ASIC configuration options from the miner's API.

&nbsp;  - `getData(value)`: Queries historical data for a specific metric from InfluxDB.



2\. \*\*Database Interaction\*\*:

&nbsp;  - Uses the InfluxDB client to query and write data.



---



\## Environment Variables

The project uses a `.env` file to store sensitive configuration:

\- `MINER\_IP\_ADDRESS`: IP address of the miner.

\- `DB\_ORG`: Organization name for InfluxDB.

\- `DB\_BUCKET`: Bucket name for InfluxDB.

\- `DB\_TOKEN`: Authentication token for InfluxDB.

\- `DB\_URL`: URL of the InfluxDB instance.

* See yourself how it should look in example.env.



---



\## How It Works

1\. \*\*Start the Server\*\*:

&nbsp;  - Run the `index.js` file to start the API server.

&nbsp;  - The server listens on port 3000.



2\. \*\*Start Logging\*\*:

&nbsp;  - Use the `/start-log` endpoint to start the logging script.

&nbsp;  - The script fetches metrics from the miner and logs them to InfluxDB.



3\. \*\*Fetch Data\*\*:

&nbsp;  - Use the `/info` or `/graph-data-year` endpoints to retrieve real-time or historical data.



4\. \*\*Manage Miner\*\*:

&nbsp;  - Use the `/restart` or `/patch-miner` endpoints to control the miner's settings.



---



\## Notes

\- Ensure the `.env` file is properly configured before running the application.

\- The miner's API must be accessible from the server's network.

\- InfluxDB must be running and reachable at the specified `DB\_URL`. You have to set it up - \[InfluxData Downloads](https://www.influxdata.com/downloads/), InfluxDB OSS 2.x


# Bitaxe Miner Monitor APK - ENGLISH

Bitaxe Miner Monitor is an Android application designed to remotely monitor my Bitaxe miner at home via a Raspberry Pi 3. The **RaspberryPi3** folder contains the code running on my Raspberry Pi, which is connected to the same network as my Bitaxe Gamma miner.

The system uses an unknown technology to convert the miner’s IP address into a typical domain name, allowing me to access the API endpoints from my phone even when I’m away from home.

Each folder includes its own documentation explaining how everything works.

This setup is useful for checking on my miner remotely.

---

## Workflow

- On the Raspberry Pi, scripts run that interact with the miner’s API endpoints. These scripts collect data, save it into InfluxDB, allow editing miner settings, and expose API endpoints that the Android app can call.

- The Android APK is a React Native frontend app that communicates with the Raspberry Pi endpoints. It lets me adjust miner settings and view graphs of the collected data.





# Bitaxe Miner Monitor APK - CZECH

Bitaxe Miner Monitor je Android aplikace pro vzdálené sledování Bitaxe mineru, který mám doma připojený přes Raspberry Pi 3. Složka **RaspberryPi3** obsahuje kód, který je stažený přímo na mém Raspberry Pi, jež je připojeno do stejné sítě jako můj Bitaxe Gamma miner.

Aplikace používá speciální (zatím neznámou) technologii pro převod IP adresy na běžnou doménu, což umožňuje volat API endpointy z mobilního telefonu i na dálku.

Každá složka obsahuje vlastní dokumentaci, kde je podrobně vysvětleno, jak celý systém funguje.

Tento nástroj je velmi užitečný pro kontrolu stavu mého mineru, když nejsem doma.

---

## Workflow

- Na Raspberry Pi běží skripty, které využívají API endpointy mineru. Tyto skripty sbírají data, ukládají je do InfluxDB, umožňují upravovat nastavení mineru a zároveň poskytují vlastní API endpointy, na které se připojuje Android aplikace.

- Android APK je frontendová aplikace napsaná v React Native. Komunikuje s Raspberry Pi přes tyto endpointy. Umožňuje upravovat nastavení mineru a zobrazovat grafy nasbíraných dat.


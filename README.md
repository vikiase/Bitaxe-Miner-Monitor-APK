# Bitaxe Miner Monitor APK

Bitaxe Miner Monitor je Android aplikace pro vzdálené sledování Bitaxe mineru, který mám doma připojený přes Raspberry Pi 3. Složka **RaspberryPi3** obsahuje kód, který je stažený přímo na mém Raspberry Pi, jež je připojeno do stejné sítě jako můj Bitaxe Gamma miner.

Aplikace používá speciální (zatím neznámou) technologii pro převod IP adresy na běžnou doménu, což umožňuje volat API endpointy z mobilního telefonu i na dálku.

Každá složka obsahuje vlastní dokumentaci, kde je podrobně vysvětleno, jak celý systém funguje.

Tento nástroj je velmi užitečný pro kontrolu stavu mého mineru, když nejsem doma.

---

## Workflow

- Na Raspberry Pi běží skripty, které využívají API endpointy mineru. Tyto skripty sbírají data, ukládají je do InfluxDB, umožňují upravovat nastavení mineru a zároveň poskytují vlastní API endpointy, na které se připojuje Android aplikace.

- Android APK je frontendová aplikace napsaná v React Native. Komunikuje s Raspberry Pi přes tyto endpointy. Umožňuje upravovat nastavení mineru a zobrazovat grafy nasbíraných dat.


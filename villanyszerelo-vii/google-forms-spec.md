# Villanyszerelő VII. kerület – Google Forms specifikáció

Ez a specifikáció a dedikált villanyszerelő landinghez tartozó Google Forms űrlap kézi létrehozásához készült.

## Űrlap címe

Villanyszerelő VII. kerület – hibabejelentés és munkaleadás

## Űrlap leírása

Kérjük, írja le röviden a hibát vagy a kért villanyszerelési munkát. A megadott adatok alapján felveszem Önnel a kapcsolatot.

Sürgős hiba esetén a telefonos kapcsolat gyorsabb.

## Kérdések

1. Név
   - típus: rövid válasz
   - kötelező: igen

2. Telefonszám
   - típus: rövid válasz
   - kötelező: igen
   - javasolt validáció: minimum 8 karakter, telefonszám jellegű minta

3. E-mail cím
   - típus: rövid válasz
   - kötelező: nem
   - validáció: e-mail

4. Cím / kerület
   - típus: rövid válasz
   - kötelező: igen

5. Ingatlan típusa
   - típus: feleletválasztós
   - kötelező: igen
   - opciók:
     - Vendéglátóhely
     - RBN lakás / apartman
     - Magánlakás
     - Egyéb

6. Mi a probléma vagy milyen munkát szeretne?
   - típus: bekezdés
   - kötelező: igen

7. Mennyire sürgős?
   - típus: feleletválasztós
   - kötelező: igen
   - opciók:
     - SOS / sürgős
     - 1–2 napon belül
     - Ráér egyeztetés szerint

8. Mikor hívható?
   - típus: feleletválasztós
   - kötelező: nem
   - opciók:
     - Reggel
     - Délelőtt
     - Délután
     - Este
     - Bármikor

9. Fotó vagy további információ van?
   - típus: bekezdés
   - kötelező: nem
   - megjegyzés: ide jöhet, hogy tud-e képet küldeni vagy van-e plusz információ

10. Kapcsolatfelvételi hozzájárulás
    - típus: jelölőnégyzet
    - kötelező: igen
    - szöveg:
      - Hozzájárulok, hogy a megadott adataim alapján kapcsolatba lépjenek velem a munkával kapcsolatban.

## Beállítások

- gyűjtse a válaszokat
- ne kérjen Google-bejelentkezést a kitöltéshez
- ne legyen kötelező a válasz másolatának kiküldése
- válasz szerkesztése: alapértelmezésben kikapcsolva

## Beküldés utáni üzenet

Köszönöm, megkaptam a hibabejelentést / munkaleadást. Hamarosan felveszem Önnel a kapcsolatot. Sürgős esetben kérem, telefonon is keressen.

## Google Sheets kapcsolat

Létrehozott külön Google Sheet:

- név: `villanyszerelo_vii_leads`
- URL: https://docs.google.com/spreadsheets/d/18ZG-Z-WlhRhM5k7AMzwcxqBWprbyUN-U_s5pkTrgwuI/edit?usp=drivesdk

Kézi összekötés lépései:

1. Nyissa meg a kész Google űrlapot.
2. A Válaszok fülön válassza a Táblázat létrehozása / meglévő táblázat kiválasztása lehetőséget.
3. Válassza a meglévő táblázat használatát.
4. Adja meg vagy válassza ki a `villanyszerelo_vii_leads` táblázatot.

## Landing integráció

Ha elkészül a dedikált Google Form, a landingben ezt az egy változót kell átírni:

- `assets/js/main.js`
- kulcs: `villanyszereloForm`

Az új `viewform` URL kerüljön ide, és automatikusan frissülni fog:

- hero Google űrlap gomb
- kapcsolat blokk Google űrlap gomb
- űrlap melletti Google űrlap gomb

## Aktuális állapot

- dedikált Google Form tényleges létrehozása ebből a környezetből nem sikerült, mert a böngészős létrehozás Google bejelentkezést kért
- külön Google Sheet ténylegesen létrejött
- a landing jelenleg ideiglenes Google Form URL-t használ, amíg a dedikált űrlap el nem készül

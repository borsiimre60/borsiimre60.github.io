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

Az űrlaphoz létrehozott és összekötött Google Sheet:

- név: `villanyszerelo_vii_leads`
- URL: https://docs.google.com/spreadsheets/d/1_xLcAaTmjd3JHsvpxqsJKY1gKJTmurHi9qbTs9OApdg/edit?gid=689357573#gid=689357573

## Landing integráció

Ha elkészül a dedikált Google Form, a landingben ezt az egy változót kell átírni:

- `assets/js/main.js`
- kulcs: `villanyszereloForm`

Az új `viewform` URL kerüljön ide, és automatikusan frissülni fog:

- hero Google űrlap gomb
- kapcsolat blokk Google űrlap gomb
- űrlap melletti Google űrlap gomb

## Aktuális állapot

- dedikált Google Form létrejött és közzé lett téve
- szerkesztő URL: https://docs.google.com/forms/d/15_gGQLGt4KIXYqdqwmFbtiMXR5gp0nRpk4NDy0coKQE/edit
- régi preview URL: https://docs.google.com/forms/d/15_gGQLGt4KIXYqdqwmFbtiMXR5gp0nRpk4NDy0coKQE/preview
- publikus respondent URL: https://docs.google.com/forms/d/e/1FAIpQLScgFKq-AejXcknwKhhu7Jrv0mvZN8TtFd9FJ0m2mZHxmvoKFQ/viewform?usp=publish-editor
- a landing `assets/js/main.js` fájlja már erre a végleges respondent URL-re van átállítva
- a form válaszai a `villanyszerelo_vii_leads` Google Sheetbe mennek
- a kérdések és opciók a landing igényeihez igazodnak
- a telefonszám és e-mail válaszvalidáció külön még nincs finomhangolva az editorban

## Deployment checklist

- ellenőrizd, hogy a `assets/js/main.js` fájlban az `ELECTRICIAN_VII_GOOGLE_FORM_URL` értéke a végleges respondent URL maradt
- add meg a `assets/js/main.js` fájlban a `BREVO_TRACKER_CONFIG.clientKey` publikus Brevo tracker azonosítót
- ha GA4 mérés is kell, tedd be külön a Google tag (`gtag`) snippetet, a mostani helper ehhez már igazodik
- kattintsd végig a telefon, e-mail és Google űrlap CTA-kat desktop és mobil nézetben
- ellenőrizd publikus deploy után, hogy a `https://borsiimre60.github.io/villanyszerelo-vii/` oldal a friss `assets/js/main.js` fájlt használja

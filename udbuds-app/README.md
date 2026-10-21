# SamBud

En React Native-pilot, hvor naboer samler praktiske opgaver og modtager bud fra en lokal virksomhed. Appen åbner direkte som **Maja Jensen**. Knappen **Virksomhed** til højre for navnet skifter til **NaboService ApS**; **Privat** skifter tilbage. Velkomsten bruger navnet fra den aktive profil i Firebase Realtime Database.

Privatprofilens fiktive adresse er **Bøgeengen 12, Frederiksberg**, og boligtypen er **Rækkehus**. Virksomheden har den fiktive adresse **Bøgeengen 4, Frederiksberg**, og branchen er **Have- og ejendomsservice**. Oplysningerne hentes fra profilerne i databasen. Adresserne er eksempler; kortet bruger fortsat de gemte koordinater uden adresseopslag.

## Start

```powershell
cd udbuds-app
npm install
npx expo start --clear
```

Åbn projektet i Expo Go på telefonen. `.env.local` indeholder Firebase-konfigurationen og er udeladt fra Git. Andre gruppemedlemmer kan kopiere `.env.example` og udfylde projektets værdier. Der bruges ikke Authentication, kontooprettelse eller skjult anonymt login.

Kortet bruger Leaflet i `react-native-webview` med OpenStreetMap som kortbaggrund. Det erstatter Google-kortet, som blev vist gråt i Expo Go på Android. Den præcise fejl i den oprindelige Google-visning er ikke fastslået fra telefonens log.

[WebView understøttes i Expo Go](https://docs.expo.dev/versions/latest/sdk/webview/), og løsningen kræver ingen Google Maps-nøgle. [Leaflet-dokumentationen](https://leafletjs.com/examples/quick-start/) beskriver kort, markører og radius. Leaflet 1.9.4 indlæses fra unpkg med integritetskontrol; kortbilleder indlæses fra OpenStreetMap med synlig attribution og normal browsercache. Internet er nødvendigt. Ved fejl vises en genindlæsningsknap. Der hentes kun kortbilleder til den aktuelle visning, ikke offlinepakker. [OpenStreetMaps vilkår for kortbilleder](https://operations.osmfoundation.org/policies/tiles/) skal vurderes igen, hvis piloten får større trafik.

Webskærmen henviser til mobilen; selve kortet er til iOS/Android. Appens tekster viser kun information relevant for brugeren; forklaringer om fiktive profiler og fælles pilotdata findes her i dokumentationen.

## Demonstration

1. Åbn **Opgaver** som Maja. **Kan tilmeldes** viser åbne opgaver inden for søgeradius og opgavens tilmeldingsradius, som Maja ikke allerede deltager i. **Tilmeldte** viser hendes tilmeldinger, også når en opgave er lukket. Kortet viser områdets åbne opgaver. De seks eksempelopgaver starter med 4, 3, 5, 2, 2 og 4 husstande og ingen bud. Hækklipning, beskæring af buske og rensning af indkørsler kan tilmeldes fra start.
2. Åbn **Kort**, tryk på hækklipning, og tilmeld husstanden. Antallet og **Mine opgaver** opdateres fra databasen.
3. Opgaven ved Forum kan ses, men ligger uden for Majas tilmeldingsradius til netop den opgave. Den forklarende besked vises i detaljerne.
4. Vælg **Virksomhed** til højre for navnet. Find hækklipningen på kortet, og afgiv fx et bud på **350 kr. pr. husstand inkl. moms** med en beskrivelse.
5. Skift til kunden, og åbn **Virksomheders bud**. Buddet vises med virksomhedens navn, beskrivelse og pris. Prisen pr. husstand ændres ikke med deltagerantallet.
6. Opret en ny opgave som Maja. Den får Majas faste position og tilmelder automatisk hendes husstand. Redigér titel, beskrivelse eller frist, eller luk opgaven.
7. Genstart appen eller åbn den på en anden telefon. Ændringerne er gemt og deles mellem demoens brugere.

Profilerne har faste positioner, så demonstrationen ikke afhænger af telefonens GPS. Kunden søger i 1.500 meters radius; virksomheden i 2.500 meter. Hver opgave har desuden sin egen tilmeldingsradius. Afstand beregnes i meter med Haversine-formlen. Kort og lister bruger samme database; privatpersonens filter tilføjer kontrol af tilmelding og opgavens radius.

## Fem nye screens i forhold til første prototype

| Screen | Funktion |
| --- | --- |
| `MapScreen` | Interaktivt kort, markører og radius |
| `AddEditOpportunityScreen` | Opret, redigér og luk egne demoopgaver |
| `MyOpportunitiesScreen` | Kundens deltagelse eller virksomhedens afgivne bud |
| `OfferScreen` | Opret og redigér pris pr. husstand med beskrivelse |
| `CompanyProfileScreen` | Virksomhedens profil og ydelser fra databasen |

De seks oprindelige screens er videreført med dynamiske data: opgaveliste, detaljer, områdeoversigt, profil (tidligere indstillinger), tilmeldte naboer og virksomheders bud. Navigationen består af fire faner og en stack til detaljesiderne. Styling ligger separat i `styles/`.

Skærmene giver grundlag for gruppens fem individuelle bidrag. Gruppen skal selv dokumentere arbejdsfordeling og ændringer, optage den nye demovideo og skrive de individuelle rapporter efter opgavekravene.

## Enkel kodestruktur

- `App.js`: navigation og knappen til rolleskift.
- `context/DemoContext.js`: én realtime-lytter på `demo`, forbindelsesstatus og aktiv demoprofil.
- `database/firebase.js`: initialiserer Firebase og Realtime Database.
- `database/demo.js`: gemmer opgaver, tilmeldinger og bud med `set`, `update` og `remove`.
- `utils/demo.js`: afstand, datoer, priser, deltager-/budantal og områdeoversigt. `taskView` klargør lister og prisetiketter uden at ændre prisen pr. husstand; skærmene fokuserer på visning.
- `components/TaskMap.js`: WebView, indlæsning, genforsøg og valg af opgaver på kortet.
- `utils/mapDocument.js`: Leaflet-kortets logik og sikker overførsel af opgavedata.
- `screens/`: de enkelte skærme.
- `components/`: genbrugelige knapper, formularfelter og opgavekort.
- `styles/`: fælles skærmstyling, knapstyling og separat kortstyling.

### Sådan læses koden

Start med `App.js` for at se navigationen. Læs derefter `screens/HomeScreen.js`: den henter fælles data, vælger opgaver med en filterfunktion og viser dem med `TaskCard`. Følg derefter et tryk ind i `DetailsScreen.js` og videre til `database/demo.js`, hvor ændringen gemmes. `context/DemoContext.js` modtager ændringen fra Firebase og opdaterer skærmene.

Almindelig app-logik bruger funktioner, `if`, `filter` og `map`. Prisvisning og optælling ligger i `utils/demo.js`. Områdeoptællingen er en enkel `for`-løkke. Kortets kommunikation mellem React Native og Leaflet er den mest tekniske del og ligger samlet i `TaskMap.js` og `mapDocument.js`.

`database-debug.log` og `firebase-debug.log` er automatisk fejlfindingsoutput. De kan slettes og er ignoreret i Git; Firebase CLI og emulatoren kan genskabe dem. `tests/` bruges til kontrol, `scripts/` til engangsopsætning og `database/.migration/` til lokale sikkerhedskopier og arbejdsfiler. Ingen af dem indlæses som skærmkode. `package-lock.json` fastholder biblioteksversioner og skal beholdes.

## Data og demoregler

```text
demo/
  profiles/
    customer/                  Maja Jensen og fast position
    company/                   NaboService ApS, ydelser og position
  tasks/
    opgave-id/
      details/                 Titel, beskrivelse, position, radius, frist, ejer
      participants/
        husstand-id/           Navn; én post pr. husstand
      offers/
        company-demo/          pricePerHousehold, description, updatedAt
```

`database/demo-seed.json` er grundlaget for engangsimporten, ikke en lokal datakilde i appen. Importen sætter frister 30–65 dage frem. Når fristen passeres, lukkes opgaven for nye tilmeldinger og bud. Eksempelopgaver tilhørende andre fiktive naboer vedligeholdes via Firebase Console.

Dette er bevidst en **fælles, offentlig demo med fiktive data**. Rolleskift er en visning, ikke adgangskontrol. Alle appens besøgende deler de samme demoidentiteter og kan udføre de tilladte demoændringer. Brug kun fiktive oplysninger.

Reglerne i `database/database.rules.json` åbner læsning af `/demo`. De tillader kun skrivning til opgavedetaljer for `customer-demo`, dennes tilmelding og `company-demo`-bud. Profiler og andre fiktive deltagere kan kun ændres med administratoradgang. Reglerne validerer felter, beløb og frister. Radiuskontrol og valget af kunde-/virksomhedshandlinger ligger i appen og er ikke sikkerhedsgrænser. Andre databasegrene er lukket for appen.

Der er ingen betaling, accept af bud eller bindende bestilling i demoen.

## Firebase-administration

Efter `npx firebase login` kan regler udgives med `npm run deploy:database`.

Engangsimporten tager en frisk sikkerhedskopi som input:

```powershell
npx firebase database:get / --project sambud-56 --output database/.migration/backup.json
node scripts/prepare-simple-demo.mjs database/.migration/backup.json
npx firebase database:update / database/.migration/simple-demo.patch.json --project sambud-56 --force
```

Opret først mappen `database/.migration/`, hvis den ikke findes. Scriptet stopper, hvis `/demo` allerede findes, så det ikke overskriver ændringer fra demonstrationen. Der bruges PATCH, som bevarer andre grene. Lokale sikkerhedskopier og logfiler er Git-ignorerede. Gem også en kopi af eksisterende regler før ændring.

## Kontrol

`npm run test:views` kontrollerer deltager-/budantal, fast pris pr. husstand, områdeoversigt og kortets dataoverførsel, markørvalg og fejlmelding.

`npm run test:database` kræver Java 21+ og tester mod den lokale Firebase-emulator `demo-sambud-tests`. Testene dækker offentlig demoadgang, afskærmning af andre data, oprettelse, til-/afmelding, bud, frister, realtime-opdateringer, afstand og danske priser.

Android- og iOS-koden kan kontrolleres med:

```powershell
npx expo export --platform android --platform ios --output-dir dist/demo-check
```

Gennemfør også demonstrationsforløbet på telefonen, herunder korttryk, tastatur og rolleskift. Afbryd forbindelsen og kontrollér, at gemmeknapper deaktiveres. En igangværende skrivning kan vente på genforbindelse.

## Demovideo

[Video af den oprindelige prototype](https://www.youtube.com/shorts/5IqHOa4Hpx8?is=q0vmvWKps-U0MXnE). Erstat med en ny optagelse af ovenstående forløb før aflevering.

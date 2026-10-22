# Teknisk vejledning til SamBud

Denne side samler de oplysninger, som ikke er nødvendige for blot at starte og prøve appen.

## Firebase og fælles demodata

Appen bruger Firebase Realtime Database uden login. Opgaver, tilmeldinger og bud hentes fra databasen og opdateres løbende på skærmene.

```text
demo/
  profiles/
    customer/                  Maja Jensen og fast position
    company/                   NaboService ApS, ydelser og position
  tasks/
    opgave-id/
      details/                 Beskrivelse, position, radius, frist og opretter
      participants/
        husstand-id/           Én tilmelding pr. husstand
      offers/
        company-demo/          Pris pr. husstand, beskrivelse og tidspunkt
```

Navigationen er altid tilgængelig. Uden indlæste profiler viser siderne en fælles vente- eller fejlbesked med mulighed for at prøve igen. Efter 10 sekunder uden svar vises en fejl. Skrivehandlinger kræver både forbindelse og indlæste profiler (`canWrite`). Der indlæses ikke lokale erstatningsopgaver.

`database/demo-seed.json` indeholder de fiktive data til engangsimporten. Appen læser fra Firebase, ikke fra denne fil.

Majas profil har den fiktive adresse Bøgeengen 12, Frederiksberg, og boligtypen Rækkehus. Virksomheden har den fiktive adresse Bøgeengen 4 og branchen Have- og ejendomsservice. Der foretages ikke adresseopslag; kortet bruger de gemte koordinater.

Husstandens søgeradius er 1.500 meter, og virksomhedens er 2.500 meter. Hver opgave har også en egen tilmeldingsradius. En opgave kan derfor ligge inden for søgeradius uden at husstanden kan tilmelde sig den. Fristen og opgavens status skal også tillade tilmelding.

`utils/demo.js` beregner afstand med Haversine-formlen og klargør deltagerantal, bud og prisvisning. Samme beregninger bruges på tværs af skærmene. Prisen pr. husstand ændres ikke med deltagerantallet.

## Databaseadgang

Demoen er fælles og offentlig. Rolleskift er et skift i visning og beskytter ikke en personlig konto.

Reglerne i `database/database.rules.json` tillader læsning af `/demo`. De tillader kun ændringer af opgaver, der tilhører `customer-demo`, denne profils tilmelding og `company-demo`-bud. Profiler og andre fiktive deltagere kan kun ændres med administratoradgang. Reglerne kontrollerer felter, beløb og frister. Andre databasegrene er lukket for appen.

Afstandskontrol og valget af handlinger for Privat og Virksomhed sker i appen. De er ikke adgangskontrol på serveren. Alle besøgende deler demoidentiteterne og kan udføre de tilladte demoændringer.

`.env.local` indeholder Firebase-konfigurationen. Værdier med `EXPO_PUBLIC_` er synlige i den byggede app; databaseadgang beskyttes af reglerne. Private nøgler og service accounts må ikke placeres i appen.

## Kortet

Kortet bruger Leaflet i en WebView med OpenStreetMap som baggrund. Et fast startpunkt på Frederiksberg vises uden Firebase; profiler og opgavemarkører tegnes først, når databasedata er indlæst. Det erstatter den oprindelige Google-kortvisning, som blev vist gråt i Expo Go på Android. Den præcise årsag til den tidligere fejl er ikke fastslået.

- `components/TaskMap.js` viser HTML-kortet og sender positioner til det.
- `utils/mapDocument.js` tegner markører og radius samt sender markørvalg tilbage til appen.
- `styles/MapStyles.js` indeholder både mobilrammen og kortets CSS.

Leaflet 1.9.4 hentes fra unpkg med integritetskontrol. Kortbilleder hentes fra OpenStreetMap, hvis kildeangivelse vises på kortet. Internet er nødvendigt. Kortet viser en fejl og en knap til at prøve igen, hvis indlæsningen fejler.

Der hentes kun kortbilleder til den aktuelle visning, ikke offlinepakker. Hvis piloten får større trafik, skal brugen vurderes i forhold til korttjenestens vilkår.

- [WebView i Expo](https://docs.expo.dev/versions/latest/sdk/webview/)
- [Leaflets vejledning](https://leafletjs.com/examples/quick-start/)
- [OpenStreetMaps vilkår for kortbilleder](https://operations.osmfoundation.org/policies/tiles/)

## Opsætning og import af demodata

Dette afsnit er til den, der administrerer Firebase-projektet. Start af appen kræver ikke, at importen køres igen.

Efter `npx firebase login` kan reglerne udgives med:

```powershell
npm run deploy:database
```

Tag først en frisk sikkerhedskopi af data og en kopi af de eksisterende regler. Opret mappen `database/.migration/`, hvis den mangler.

```powershell
npx firebase database:get / --project sambud-56 --output database/.migration/backup.json
node scripts/prepare-simple-demo.mjs database/.migration/backup.json
npx firebase database:update / database/.migration/simple-demo.patch.json --project sambud-56 --force
```

Scriptet forbereder kun importfilen. Det stopper, hvis `/demo` allerede findes, så eksisterende demoændringer ikke overskrives. Importen bruger en delvis opdatering, som bevarer andre grene. Fristerne sættes 30–65 dage frem. Eksempelopgaver, der tilhører andre fiktive naboer, vedligeholdes i Firebase Console.

## Kontrol af appen

`npm run test:views` kontrollerer filtre, deltager- og budantal, fast pris pr. husstand, områdeoversigt og kommunikationen med kortet.

`npm run test:database` kræver Java 21 eller nyere. Testene bruger en lokal Firebase-emulator med projekt-ID `demo-sambud-tests`, ikke den aktive database. De kontrollerer blandt andet adgangsregler, oprettelse, tilmelding, bud, frister og opdateringer mellem to forbindelser.

Android- og iOS-koden kan kontrolleres med:

```powershell
npx expo export --platform android --platform ios --output-dir dist/demo-check
```

Prøv også appen på telefonen: korttryk, tastatur, rolleskift, tilmelding og bud. Genstart appen og kontroller, at ændringerne huskes. Afbryd forbindelsen og kontroller, at gemmeknapper deaktiveres. En gemning, som allerede er startet, kan vente på genforbindelse.

## Øvrige filer

- `tests/` indeholder kontroller, ikke appens skærmkode.
- `scripts/` bruges til engangsopsætning.
- `database/.migration/` indeholder lokale importfiler og sikkerhedskopier og deles ikke via Git.
- `database-debug.log` og `firebase-debug.log` er midlertidige fejlfindingsfiler. De kan slettes og kan blive gendannet af Firebase-værktøjerne.
- `package-lock.json` fastholder biblioteksversionerne og skal beholdes.

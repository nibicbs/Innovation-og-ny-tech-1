# SammenBud

SammenBud er en simpel React Native-demo, hvor naboer på samme villavej kan samle en fælles opgave og få virksomheder i nærområdet til at byde på den.

Et eksempel kan være vinduespudsning for 10 huse på samme vej. Ved at samle opgaverne kan naboerne gøre opgaven mere attraktiv for lokale virksomheder.

## Funktioner

- Login og oprettelse af bruger med Firebase Authentication
- Login bevares på telefonen med AsyncStorage; logud findes under Indstillinger
- Liste over fælles opgaver i nærområdet
- Visning af opgavedetaljer
- Navigation mellem `Opgaver`, `Mine opgaver`, `Overblik` og `Indstillinger`
- Opret/redigér egne opgaver, luk tilmelding, og tilmeld/afmeld din egen konto
- Opgaver, deltagere og tilbud opdateres løbende fra Firebase Realtime Database
- Enkel side med indstillinger for vej, radius og notifikationer
- Opgavedetaljer åbnes ved at trykke på en opgave
- Navigation til tilmeldte naboer
- Navigation til virksomheders bud
- Enkel områdeoversigt
- Styling i separate style-filer

## Teknologier

- React Native
- Expo
- React Navigation
- Ionicons
- Firebase JS SDK og AsyncStorage

## Start projektet

Gå ind i projektmappen:

```powershell
cd udbuds-app
```

Installer dependencies, hvis det er nødvendigt:

```powershell
npm install
```

### Firebase-opsætning

1. Registrér en webapp i dit Firebase-projekt, og aktivér **Authentication → Email/Password**.
2. Kopiér `.env.example` til `.env.local`, og udfyld værdierne fra `firebaseConfig`.
3. Opret **Realtime Database**, og indsæt dens præcise URL som `EXPO_PUBLIC_FIREBASE_DATABASE_URL`. URL'en er ikke nødvendig for login, men bliver nødvendig, når opgaverne flyttes til databasen.
4. Genstart Expo efter ændringer i miljøvariablerne.

`.env.local` er udeladt fra Git. De øvrige gruppemedlemmer skal have deres egen lokale konfiguration. Firebase-webkonfiguration er synlig i den byggede app og giver ikke i sig selv adgangsbeskyttelse; databaseadgang skal styres med Firebase Security Rules. Indsæt aldrig private nøgler eller service accounts i appen.

Start Expo:

```powershell
npx expo start
```

Scan QR-koden med Expo Go på din telefon.

### Status på videreudviklingen

De nye screens er indtil videre `AuthScreen`, `AddEditOpportunityScreen` og `MyOpportunitiesScreen`. Opgaver, tilbud og deltagelse kommer fra Realtime Database. De tre oprindelige opgaver og deres tilbud/naboer importeres som markerede eksempler. En ny bruger er ikke automatisk tilmeldt disse opgaver. Ved oprettelse af en ny opgave gemmes opgaven og opretterens tilmelding atomisk. Frister gemmes som tidspunkter, og nye tilmeldinger afvises efter fristen eller når opgaven er lukket.

Prissammensætningen skal afklares, før tilbudsfunktionen videreudvikles. Den eksisterende demo-beregning er bevaret. Kundekonti kan ikke redigere tilbud. Kort, kontrol af geografisk radius og virksomhedsprofil er endnu ikke implementeret. Vej, søgeradius og notifikationskontakten under Indstillinger er fortsat demoindstillinger; de filtrerer ikke databaseopgaverne og sender ikke notifikationer.

### Data og adgangsregler

- `opportunities/{id}`: titel, område, beskrivelse, frist, status og opretter-ID.
- `participants/{id}/{uid}`: én rigtig tilmelding pr. konto med tilmeldingstidspunkt.
- `offers/{id}`: de hidtidige eksempeltilbud og prisgrundlag, skrivebeskyttet for appbrugere.
- `demoParticipants/{id}`: de gamle fiktive naboer, tydeligt markeret og adskilt fra konti.

`database/database.rules.json` tillader kun indloggede brugere at læse disse fire datagrupper. Kun opretteren kan ændre sin opgave; kun brugeren selv kan ændre sin tilmelding. Opgaver lukkes frem for at blive slettet. Tilbud og eksempeldata vedligeholdes med administratoradgang. Reglerne validerer også felter og frister på serveren. Deltagernes UID'er er læsbare for indloggede konti, men deltagervisningen indeholder ikke navne, e-mails eller adresser.

Firebase-opsætningen ligger i `firebase.json` og `.firebaserc`. Efter administratorlogin med `npx firebase login` udgives reglerne med `npm run deploy:database`.

Engangsimporten forberedes med `node scripts/prepare-demo-import.mjs <backup.json> <patch.json>`. Scriptet springer allerede eksisterende demo-ID'er over og ændrer ikke rigtige tilmeldinger. Tag altid først et nyt snapshot med Firebase CLI. Brug `firebase database:update / <patch.json> --project sambud-56`, ikke `database:set /`, som erstatter hele databasen. Lokal backup og importfiler ligger i den Git-ignorerede mappe `database/.migration/`.

### Automatiske databasetests

`npm run test:database` starter en lokal emulator for **demo-sambud-tests**, ikke den rigtige database. Det kræver Java 21 eller nyere på PATH. Testene dækker bl.a. kontoadgang, ejerskab, atomisk oprettelse, samtidige tilmeldinger, frister og realtime-opdateringer mellem to brugere.

### Manuel kontrol på telefon

1. Opret en testkonto. Kontroller, at den vises under Authentication i Firebase, og at appen åbner Opgaver.
2. Under Indstillinger skal kontoens e-mail vises.
3. Luk appen helt, og åbn igen. Den samme konto skal stadig være logget ind.
4. Log ud. Login skal vises, og tilbage-navigation må ikke åbne opgaverne.
5. Log ind igen, og prøv også forkert adgangskode, en allerede registreret e-mail og manglende internet. Der skal vises en dansk fejlbesked.
6. Ved registrering: Kontroller tomme felter, for kort adgangskode og adgangskoder, der ikke matcher.
7. Opret en opgave med konto A. Den skal vises under Mine opgaver, og A skal være tilmeldt.
8. Log ind med konto B på en anden telefon. Tilmeld B; begge telefoner skal vise det nye deltagerantal. B må ikke kunne redigere A's opgave.
9. Afmeld B, og kontrollér deltagerlisten og Mine opgaver. Genstart appen og kontrollér, at ændringen huskes.
10. Luk opgaven som A. B må ikke længere tilmelde sig. En allerede tilmeldt konto skal stadig kunne afmelde sig.
11. Afbryd internettet. Appen viser forbindelsesstatus og starter ikke nye ændringer; igangværende skrivninger afventer genforbindelse. Forlad ikke en oprettelsesformular, mens den gemmer.

## Projektstruktur

- `App.js` indeholder bundnavigation og navigation til opgavedetaljer
- `screens/` indeholder appens views og screens
- `components/` indeholder genbrugelige komponenter
- `data/` indeholder de historiske eksempeldata til engangsimport; bruges ikke af appen
- `styles/` indeholder styling til screens og komponenter
- `database/firebase.js` samler Firebase-konfiguration, Authentication og Realtime Database
- `database/auth.native.js` konfigurerer loginlagring på telefonen; `auth.js` bruges på web
- `context/AuthContext.js` følger loginstatus og deler den med appens skærme
- `context/OpportunitiesContext.js` samler databaseabonnementer og fjerner dem ved logud
- `database/opportunities.js` skriver opgaver og tilmeldinger til Firebase
- `utils/authErrors.js` oversætter loginfejl til dansk

## Demovideo

Indsæt linket til demovideoen her:

[Se demovideoen](https://www.youtube.com/shorts/5IqHOa4Hpx8?is=q0vmvWKps-U0MXnE)

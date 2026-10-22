# SamBud

SamBud er en mobilapp, hvor naboer kan samle serviceopgaver og få tilbud fra en lokal virksomhed.

Appen åbner som den fiktive husstand **Maja Jensen**. Tryk på **Virksomhed** ved siden af navnet for at se appen som **NaboService ApS**. Tryk på **Privat** for at skifte tilbage.

## Demovideo og aflevering

[Se videoen af prototype](https://youtu.be/o2uKBIZgvm0).

## Start appen

Kør fra projektets mappe:

```powershell
cd udbuds-app
npm install
npx expo start --clear
```

Åbn derefter appen i **Expo Go** på telefonen. Appen kræver internet.

Firebase-oplysningerne ligger i `.env.local`. Hvis filen mangler, kan du kopiere `.env.example` til `.env.local` og udfylde værdierne fra Firebase-projektet. Genstart Expo bagefter. Filen deles ikke via GitHub. Uden Firebase-oplysninger kan du stadig åbne siderne og skifte mellem Privat og Virksomhed. Datafelter viser en besked om, at oplysningerne ikke kunne hentes, og gemmeknapper er deaktiveret. Med internet kan kortet stadig vises med et fast startpunkt på Frederiksberg, men uden opgavemarkører.

## Prøv appen

1. Find en opgave under **Opgaver** eller på **Kort**.
2. Åbn eksempelvis hækklipningen, og tilmeld husstanden.
3. Skift til **Virksomhed**, åbn samme opgave, og afgiv et bud med pris og beskrivelse.
4. Skift tilbage til **Privat**, og se buddet under opgaven.
5. Prøv også at oprette en opgave og finde den under **Mine opgaver**.

**Kan tilmeldes** viser åbne opgaver, som husstanden kan deltage i. **Tilmeldte** viser husstandens eksisterende tilmeldinger. Virksomheden kan følge sine bud under **Mine bud**.

Bud angives som **pris pr. husstand inklusive moms**. Prisen falder ikke automatisk, når flere tilmelder sig.

## Find rundt i koden

| Fil eller mappe | Hvad den gør |
| --- | --- |
| `App.js` | Samler navigationen og skiftet mellem Privat og Virksomhed. |
| `screens/` | Indeholder appens skærme. |
| `components/` | Indeholder fælles knapper, tekstfelter, opgavekort og kortvisningen. |
| `context/DemoContext.js` | Henter data fra Firebase og deler dem mellem skærmene. |
| `database/demo.js` | Gemmer opgaver, tilmeldinger og bud. |
| `utils/demo.js` | Beregner afstande og antal samt formaterer priser og datoer. |
| `utils/mapDocument.js` | Styrer kortets markører og beskeder til appen. |
| `styles/` | Indeholder farver, afstande og anden styling. |

## Nye skærme i version 2

De seks skærme fra første version er videreført. Derudover er disse fem tilføjet:

| Skærm | Funktion |
| --- | --- |
| `MapScreen` | Viser opgaver i nærområdet på et kort. |
| `AddEditOpportunityScreen` | Opretter, redigerer og lukker egne opgaver. |
| `MyOpportunitiesScreen` | Viser husstandens opgaver eller virksomhedens bud. |
| `OfferScreen` | Opretter og redigerer et bud. |
| `CompanyProfileScreen` | Viser virksomhedens beskrivelse og ydelser. |

## Om demonstrationen

- Profiler og opgaver er fiktive. Alle, der åbner demoen, deler de samme profiler og ændringer.
- Data gemmes i Firebase og huskes, når appen åbnes igen.
- Positionerne er faste. Kortet bruger OpenStreetMap og telefonens GPS bruges ikke.
- Kortet er lavet til mobilappen. Webversionen viser en henvisning til opgavelisten.
- Der er ikke personligt login, betaling eller accept af bud. Brug kun fiktive oplysninger.

## Kontrol og tekniske detaljer

Kør `npm run test:views` fra `udbuds-app` for at kontrollere blandt andet filtre, optællinger, priser og kortets beskeder.

Opsætning af databasen, databasetests og kortets teknik er beskrevet i [den tekniske vejledning](docs/TEKNIK.md).
// Forbereder en fil med fiktive data til import. Scriptet ændrer ikke selve databasen.
// Brug en frisk databasekopi som input; scriptet stopper, hvis demoen allerede findes.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (!process.argv[2]) throw new Error('Angiv stien til en frisk database-backup.');
const before = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8').replace(/^\uFEFF/, ''));
if (before?.demo) throw new Error('/demo findes allerede. Importen stopper for at bevare ændringer fra appen.');
const demo = JSON.parse(readFileSync(new URL('../database/demo-seed.json', import.meta.url), 'utf8'));
// Giv eksempelopgaverne nye datoer, så de ikke starter med udløbne frister.
const now = Date.now();
for (const [index, task] of Object.values(demo.tasks).entries()) {
    Object.assign(task.details, { createdAt: now, updatedAt: now, deadlineAt: now + (30 + index * 7) * 86400000 });
}
// Gem kun demoens profiler og opgaver i importfilen, så andre databasegrene bevares.
mkdirSync(new URL('../database/.migration/', import.meta.url), { recursive: true });
writeFileSync(new URL('../database/.migration/simple-demo.patch.json', import.meta.url),
    JSON.stringify({ 'demo/profiles': demo.profiles, 'demo/tasks': demo.tasks }, null, 2));
console.log(`Klar: 2 demoprofiler og ${Object.keys(demo.tasks).length} opgaver uden bud. Kun /demo tilføjes.`);

import { readFileSync, writeFileSync } from 'node:fs';

// Kør kun mod et nyt backup-snapshot. Eksisterende ID'er springes over.
const [backupPath, outputPath] = process.argv.slice(2);
if (!backupPath || !outputPath) throw new Error('Brug: node scripts/prepare-demo-import.mjs <backup.json> <patch.json>');
const existing = JSON.parse(readFileSync(backupPath, 'utf8').replace(/^\uFEFF/, '')) || {};
const source = readFileSync(new URL('../data/opportunities.js', import.meta.url), 'utf8');
const { opportunities } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const now = Date.now();
const patch = {};
for (const original of opportunities) {
    const id = `demo-${original.id}`;
    if (['opportunities', 'participants', 'offers', 'demoParticipants'].some((path) => existing[path]?.[id])) continue;
    const days = Number(original.deadline.match(/\d+/)?.[0]);
    if (!days) throw new Error(`Mangler frist for ${id}`);
    patch[`opportunities/${id}`] = {
        title: original.title, location: original.location,
        description: 'Eksempelopgave fra SammenBuds første prototype.',
        deadlineAt: now + days * 86400000, status: original.status,
        ownerId: 'demo', createdAt: now, updatedAt: now, isDemo: true,
    };
    patch[`offers/${id}`] = {
        expectedCost: original.expectedCost,
        items: Object.fromEntries((original.offers || []).map((offer, index) => [`offer-${index + 1}`, offer])),
    };
    patch[`demoParticipants/${id}`] = Object.fromEntries(original.participatingNeighbors.map((label, index) => [`neighbor-${index + 1}`, { label }]));
}
writeFileSync(outputPath, JSON.stringify(patch, null, 2) + '\n');
console.log(`Forberedt ${Object.keys(patch).filter((path) => path.startsWith('opportunities/')).length} nye eksempelopgaver. Eksisterende data er ikke med i patchen.`);

export const OPEN_STATUSES = ['Åben for bud', 'Afventer flere naboer'];
export const TASK_STATUSES = [...OPEN_STATUSES, 'Lukket'];

export function canJoinOpportunity(opportunity, now = Date.now()) {
    return Boolean(opportunity && OPEN_STATUSES.includes(opportunity.status) && opportunity.deadlineAt > now);
}

export function formatDeadline(timestamp, now = Date.now()) {
    if (!Number.isFinite(timestamp)) return 'Ingen frist';
    if (timestamp <= now) return 'Tilmeldingsfristen er udløbet';
    const days = Math.ceil((timestamp - now) / 86400000);
    return days === 1 ? 'Frist inden for 1 døgn' : `Frist om ${days} dage`;
}

export function dateInputValue(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDeadline(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 23, 59, 59, 999);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        ? date.getTime() : NaN;
}

// Samme felter og længder kontrolleres også af reglerne på Firebase-serveren.
export function validateOpportunityForm(form, now = Date.now()) {
    if (!form.title.trim() || form.title.trim().length > 120) return 'Titlen skal være mellem 1 og 120 tegn.';
    if (!form.location.trim() || form.location.trim().length > 120) return 'Området skal være mellem 1 og 120 tegn.';
    if (form.description.trim().length > 3000) return 'Beskrivelsen må højst være 3000 tegn.';
    if (!TASK_STATUSES.includes(form.status)) return 'Vælg en gyldig status.';
    if (!Number.isFinite(parseDeadline(form.deadline))) return 'Skriv en gyldig dato som ÅÅÅÅ-MM-DD.';
    if (form.status !== 'Lukket' && parseDeadline(form.deadline) <= now) return 'Vælg en tilmeldingsfrist i fremtiden, eller luk opgaven.';
    return '';
}

// Visninger bygges fra databasen. Der gemmes hverken deltagerantal eller en global "jeg er tilmeldt"-værdi.
export function combineOpportunities(data, uid) {
    return Object.entries(data.opportunities || {}).map(([id, task]) => {
        const realParticipants = Object.entries(data.participants?.[id] || {})
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([participantId], index) => ({
                id: participantId,
                label: participantId === uid ? 'Dig' : `Deltager ${index + 1}`,
                isDemo: false,
            }));
        const demoParticipants = Object.entries(data.demoParticipants?.[id] || {}).map(([key, value]) => ({
            id: `demo-${key}`, label: value.label, isDemo: true,
        }));
        const offerData = data.offers?.[id] || {};
        return {
            ...task, id,
            isUserParticipating: Boolean(data.participants?.[id]?.[uid]),
            participants: [...realParticipants, ...demoParticipants],
            realParticipantCount: realParticipants.length,
            demoParticipantCount: demoParticipants.length,
            offers: Object.entries(offerData.items || {}).map(([offerId, offer]) => ({ ...offer, id: offerId })),
            expectedCost: offerData.expectedCost || 0,
        };
    }).sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
}

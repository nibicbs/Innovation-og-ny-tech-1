// Afstand mellem to gemte positioner (Haversine), i meter.
export function distanceMeters(a, b) {
    if (!a || !b || ![a.latitude, a.longitude, b.latitude, b.longitude].every(Number.isFinite)) return Infinity;
    const radians = (degrees) => degrees * Math.PI / 180;
    const lat = radians(b.latitude - a.latitude);
    const lon = radians(b.longitude - a.longitude);
    const h = Math.sin(lat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(lon / 2) ** 2;
    return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

export function isOpen(task, now = Date.now()) { return task?.status === 'open' && task.deadlineAt > now; }
export function canJoin(task, customer, now = Date.now()) {
    return isOpen(task, now) && distanceMeters(customer, task) <= task.radiusMeters;
}
export function nearbyTasks(tasks, profile) { return tasks.filter((task) => task.distance <= profile.radiusMeters); }
export function customerTasks(tasks, profile, filter, now = Date.now()) {
    if (filter === 'joined') {
        return tasks.filter((task) => task.participants[profile.id]);
    }
    // Vis kun nye opgaver, som husstanden faktisk kan tilmelde sig.
    return nearbyTasks(tasks, profile).filter((task) =>
        !task.participants[profile.id] && canJoin(task, profile, now));
}
// Klargør data ét sted, så skærmene kun skal vise dem.
export function taskView(id, task, profile) {
    const participants = task.participants || {};
    const offers = task.offers || {};
    return {
        ...task.details, id, participants, offers,
        deadlineLabel: new Date(task.details.deadlineAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' }),
        participantCount: Object.keys(participants).length,
        participantList: Object.entries(participants).map(([id, person]) => ({ id, ...person })),
        offerCount: Object.keys(offers).length,
        offerList: Object.entries(offers).map(([id, offer]) => ({
            id, ...offer, priceLabel: money(offer.pricePerHousehold),
        })),
        distance: profile ? distanceMeters(profile, task.details) : 0,
    };
}
export function areaSummary(tasks, now = Date.now()) {
    const summary = { openCount: 0, participantCount: 0, offerCount: 0 };
    for (const task of tasks) {
        if (isOpen(task, now)) summary.openCount += 1;
        summary.participantCount += task.participantCount;
        summary.offerCount += task.offerCount;
    }
    return summary;
}
export function money(amount) { return `${amount.toLocaleString('da-DK', { maximumFractionDigits: 2 })} kr.`; }
export function formatDistance(distance) { return distance < 1000 ? `${Math.round(distance)} m` : `${(distance / 1000).toFixed(1).replace('.', ',')} km`; }
export function dateInput(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 23, 59, 59, 999);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date.getTime() : NaN;
}
export function parsePrice(value) {
    return /^\d+([.,]\d{1,2})?$/.test(value.trim()) ? Number(value.trim().replace(',', '.')) : NaN;
}

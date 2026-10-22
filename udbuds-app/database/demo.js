import { push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { rtdb } from './firebase';

// Et eksisterende ID betyder redigering. Ellers får opgaven et nyt ID.
export async function saveTask(fields, customer, taskId) {
    const id = taskId || push(ref(rtdb, 'demo/tasks')).key;
    if (taskId) {
        await update(ref(rtdb, `demo/tasks/${id}/details`), { ...fields, updatedAt: serverTimestamp() });
    } else {
        // Gem den nye opgave og opretterens tilmelding samlet: begge gemmes eller ingen.
        await update(ref(rtdb, `demo/tasks/${id}`), {
            details: {
                ...fields, ownerId: customer.id, ownerName: customer.name,
                location: customer.location, latitude: customer.latitude, longitude: customer.longitude,
                radiusMeters: customer.radiusMeters, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
            },
            [`participants/${customer.id}`]: { name: customer.name },
        });
    }
    return id;
}

// Samme husstand bruger samme ID, så gentagne tilmeldinger ikke tælles dobbelt.
// Er husstanden allerede tilmeldt, fjernes dens tilmelding i stedet.
export function joinTask(id, customer, joined) {
    const target = ref(rtdb, `demo/tasks/${id}/participants/${customer.id}`);
    return joined ? remove(target) : set(target, { name: customer.name });
}

export function saveOffer(id, company, pricePerHousehold, description) {
    // Ét bud pr. virksomhed pr. opgave. Et nyt tryk opdaterer samme bud.
    return set(ref(rtdb, `demo/tasks/${id}/offers/${company.id}`), {
        pricePerHousehold, description: description.trim(), updatedAt: serverTimestamp(),
    });
}

import { push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { auth, rtdb } from './firebase';
import { parseDeadline, validateOpportunityForm } from '../utils/opportunities';

function currentUserId() {
    if (!rtdb) throw new Error('Databasen er ikke konfigureret.');
    if (!auth?.currentUser) throw new Error('Log ind for at ændre opgaver.');
    return auth.currentUser.uid;
}

export async function saveOpportunity(form, opportunityId) {
    const uid = currentUserId();
    const validation = validateOpportunityForm(form);
    if (validation) throw new Error(validation);
    const fields = {
        title: form.title.trim(), location: form.location.trim(),
        description: form.description.trim(), deadlineAt: parseDeadline(form.deadline),
        status: form.status, updatedAt: serverTimestamp(),
    };
    if (opportunityId) {
        // Opdater kun opgavefelter. Tilbud og deltagere ligger separat.
        await update(ref(rtdb, `opportunities/${opportunityId}`), fields);
        return opportunityId;
    }
    const id = push(ref(rtdb, 'opportunities')).key;
    // Opgaven og opretterens tilmelding gemmes samlet eller slet ikke.
    await update(ref(rtdb), {
        [`opportunities/${id}`]: { ...fields, ownerId: uid, createdAt: serverTimestamp(), isDemo: false },
        [`participants/${id}/${uid}`]: { joinedAt: serverTimestamp() },
    });
    return id;
}

export async function setParticipation(opportunityId, join) {
    const uid = currentUserId();
    const participantRef = ref(rtdb, `participants/${opportunityId}/${uid}`);
    // Bruger-ID som nøgle forhindrer dobbelte tilmeldinger, også fra to telefoner.
    if (join) await set(participantRef, { joinedAt: serverTimestamp() });
    else await remove(participantRef);
}

export function databaseErrorMessage(error) {
    const code = String(error?.code || '').toLowerCase();
    if (code.includes('permission')) return 'Du har ikke adgang til denne handling. Opgaven kan være lukket, fristen udløbet, eller databaseadgangen mangler.';
    if (code.includes('network') || code.includes('unavailable')) return 'Forbindelsen til databasen blev afbrudt. Tjek dit internet.';
    return 'Ændringen kunne ikke gemmes. Prøv igen.';
}

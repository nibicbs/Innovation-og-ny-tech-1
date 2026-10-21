import { createContext, useContext, useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { rtdb } from '../database/firebase';
import { taskView } from '../utils/demo';

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
    const [data, setData] = useState(null);
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [connected, setConnected] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!rtdb) { setError('Forbindelsen kunne ikke oprettes.'); return; }
        // Én fælles lytter holder kortet, listerne og detaljerne opdateret.
        const stopData = onValue(ref(rtdb, 'demo'), (snapshot) => {
            const value = snapshot.val();
            setData(value);
            setError(value?.profiles?.customer && value?.profiles?.company ? '' : 'Profilen kunne ikke hentes. Prøv igen.');
        }, () => setError('Opgaverne kunne ikke hentes. Kontrollér din forbindelse, og prøv igen.'));
        const stopConnection = onValue(ref(rtdb, '.info/connected'), (snapshot) => setConnected(snapshot.val() === true));
        return () => { stopData(); stopConnection(); };
    }, [attempt]);

    const profile = data?.profiles?.[role];
    const tasks = Object.entries(data?.tasks || {}).map(([id, task]) => taskView(id, task, profile))
        .sort((a, b) => a.distance - b.distance);

    return <DemoContext.Provider value={{
        role, setRole, profile, profiles: data?.profiles, tasks, connected, error,
        loading: !data && !error,
        retry: () => { setError(''); setAttempt((value) => value + 1); },
    }}>{children}</DemoContext.Provider>;
}

export function useDemo() { return useContext(DemoContext); }

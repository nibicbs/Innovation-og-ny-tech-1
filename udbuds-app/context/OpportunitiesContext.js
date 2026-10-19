import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { rtdb } from '../database/firebase';
import { useAuth } from './AuthContext';
import { combineOpportunities } from '../utils/opportunities';

const OpportunitiesContext = createContext(null);
const paths = ['opportunities', 'participants', 'offers', 'demoParticipants'];

export function OpportunitiesProvider({ children }) {
    const { user } = useAuth();
    const [snapshots, setSnapshots] = useState({});
    const [errors, setErrors] = useState({});
    const [connected, setConnected] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!user || !rtdb) return;
        let active = true;
        const unsubscribe = paths.map((path) => onValue(ref(rtdb, path), (snapshot) => {
            if (!active) return;
            setSnapshots((previous) => ({ ...previous, [path]: snapshot.val() || {} }));
            setErrors((previous) => ({ ...previous, [path]: null }));
        }, (error) => {
            if (active) setErrors((previous) => ({ ...previous, [path]: error }));
        }));
        unsubscribe.push(onValue(ref(rtdb, '.info/connected'), (snapshot) => {
            if (active) setConnected(snapshot.val() === true);
        }));
        return () => { active = false; unsubscribe.forEach((stop) => stop()); };
    }, [user?.uid, attempt]);

    const opportunities = useMemo(() => combineOpportunities(snapshots, user?.uid), [snapshots, user?.uid]);
    const error = !rtdb ? 'Appen mangler forbindelse til sin database.'
        : Object.values(errors).some(Boolean) ? 'Opgaverne kunne ikke hentes. Databaseadgangen skal være aktiveret for din konto.' : null;
    const loading = !error && paths.some((path) => snapshots[path] === undefined);
    const retry = () => { setErrors({}); setSnapshots({}); setAttempt((value) => value + 1); };

    return (
        <OpportunitiesContext.Provider value={{ opportunities, loading, error, connected, retry }}>
            {children}
        </OpportunitiesContext.Provider>
    );
}

export function useOpportunities() { return useContext(OpportunitiesContext); }

export function useOpportunity(id) {
    const context = useOpportunities();
    return { ...context, opportunity: context.opportunities.find((item) => item.id === id) };
}

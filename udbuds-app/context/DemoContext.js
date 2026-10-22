import { createContext, useContext, useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { rtdb } from '../database/firebase';
import { taskView } from '../utils/demo';

const DemoContext = createContext(null);

// Samler databaseindhold og den valgte demoprofil ét sted til alle skærmene.
export function DemoProvider({ children }) {
    const [data, setData] = useState(null);
    // Rolleskift ændrer kun visningen; der er ikke personligt login i demoen.
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [connected, setConnected] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!rtdb) {
            setError('Forbindelsen kunne ikke oprettes.');
            return;
        }
        // Ved manglende svar vises en fejl; navigationen kan stadig bruges.
        const timer = setTimeout(() => setError('Databasen svarede ikke. Prøv igen.'), 10000);
        // Én fælles lytter holder kortet, listerne og detaljerne opdateret.
        const stopData = onValue(ref(rtdb, 'demo'), (snapshot) => {
            clearTimeout(timer);
            const value = snapshot.val();
            setData(value);
            if (value?.profiles?.customer && value?.profiles?.company) {
                setError('');
            } else {
                setError('Profilen kunne ikke hentes. Prøv igen.');
            }
        }, () => {
            clearTimeout(timer);
            setError('Data kunne ikke hentes. Kontrollér databaseforbindelsen, og prøv igen.');
        });
        // Firebase fortæller særskilt, om appen har forbindelse til databasen.
        const stopConnection = onValue(ref(rtdb, '.info/connected'), (snapshot) => {
            setConnected(snapshot.val() === true);
        });
        // Stop de gamle lyttere, før de oprettes igen eller denne del af appen fjernes.
        return () => {
            clearTimeout(timer);
            stopData();
            stopConnection();
        };
    }, [attempt]);

    // Vælg profilen, og klargør opgaverne med de nærmeste først.
    // Manglende data erstattes ikke med fiktive profiler eller lokale opgaver.
    const hasData = !error && Boolean(data?.profiles?.customer && data?.profiles?.company);
    const profiles = hasData ? data.profiles : null;
    const profile = profiles?.[role];
    const tasks = Object.entries(hasData ? data.tasks || {} : {}).map(([id, task]) => {
        return taskView(id, task, profile);
    });
    tasks.sort((a, b) => a.distance - b.distance);

    function retry() {
        setData(null);
        setConnected(false);
        setError('');
        setAttempt((value) => value + 1);
    }

    return <DemoContext.Provider value={{
        role, setRole, profile, profiles, tasks, connected, error,
        // Alle gemmeknapper kræver både forbindelse og indlæste profiler.
        canWrite: connected && hasData,
        loading: !data && !error,
        retry,
    }}>{children}</DemoContext.Provider>;
}

// En genvej, som skærmene bruger til at hente de fælles data.
export function useDemo() {
    return useContext(DemoContext);
}

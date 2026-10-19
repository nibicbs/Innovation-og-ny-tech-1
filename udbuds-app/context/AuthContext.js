import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseSetupError, missingFirebaseFields } from '../database/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(auth));
    const [sessionError, setSessionError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const isConfigured = Boolean(auth) && !firebaseSetupError && missingFirebaseFields.length === 0;

    useEffect(() => {
        if (!isConfigured) {
            setLoading(false);
            return;
        }

        // Vent på det gemte login, før appens navigation vises.
        return onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setSessionError(null);
            setLoading(false);
        }, (error) => {
            setUser(null);
            setSessionError(error);
            setLoading(false);
        });
    }, [isConfigured, retryCount]);

    const retrySession = () => {
        setSessionError(null);
        setLoading(true);
        setRetryCount((value) => value + 1);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isConfigured, sessionError, retrySession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

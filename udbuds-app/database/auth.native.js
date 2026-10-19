import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Metro vælger denne fil på telefonen. AsyncStorage bevarer login efter genstart.
export function createAuth(app) {
    try {
        return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch (error) {
        // Fast Refresh kan genindlæse filen, selvom Auth allerede er oprettet.
        if (error.code === 'auth/already-initialized') return getAuth(app);
        throw error;
    }
}

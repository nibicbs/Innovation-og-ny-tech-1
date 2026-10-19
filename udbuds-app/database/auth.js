import { getAuth } from 'firebase/auth';

// Web bruger Firebase SDK'ets indbyggede browserlagring.
export function createAuth(app) {
    return getAuth(app);
}

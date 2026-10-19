// Vis forståelige beskeder frem for Firebase SDK'ets engelske fejltekster.
export function getAuthErrorMessage(error) {
    switch (error?.code) {
        case 'auth/invalid-email':
            return 'Indtast en gyldig e-mailadresse.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'E-mail eller adgangskode er forkert.';
        case 'auth/email-already-in-use':
            return 'E-mailadressen er allerede i brug. Prøv at logge ind.';
        case 'auth/weak-password':
        case 'auth/password-does-not-meet-requirements':
            return 'Vælg en stærkere adgangskode med mindst 6 tegn. Der kan gælde yderligere krav.';
        case 'auth/network-request-failed':
            return 'Der kunne ikke oprettes forbindelse. Tjek dit internet, og prøv igen.';
        case 'auth/too-many-requests':
            return 'Der har været for mange forsøg. Vent lidt, og prøv igen.';
        case 'auth/user-disabled':
            return 'Denne konto er deaktiveret.';
        case 'auth/operation-not-allowed':
        case 'auth/invalid-api-key':
        case 'auth/configuration-not-found':
        case 'auth/app-not-authorized':
            return 'Login er ikke tilgængeligt lige nu. Kontakt den ansvarlige for appen.';
        default:
            return 'Handlingen kunne ikke gennemføres. Prøv igen.';
    }
}

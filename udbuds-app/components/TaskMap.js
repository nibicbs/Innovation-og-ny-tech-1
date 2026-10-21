import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Button from './ButtonComponent';
import { mapDocument, mapUpdateScript } from '../utils/mapDocument';
import styles, { mapCss } from '../styles/MapStyles';

const source = { html: mapDocument(mapCss), baseUrl: 'https://sambud-56.firebaseapp.com/' };

export default function TaskMap({ profile, profiles, tasks, selectedId, onSelect }) {
    const webview = useRef(null);
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState('loading');
    const [attempt, setAttempt] = useState(0);
    // Send opgavernes positioner til kortet, når data eller markørvalg ændres.
    useEffect(() => {
        if (ready) webview.current?.injectJavaScript(mapUpdateScript({
            profile, profiles, selectedId,
            tasks: tasks.map(({ id, title, latitude, longitude, radiusMeters }) => ({ id, title, latitude, longitude, radiusMeters })),
        }));
    }, [ready, profile, profiles, tasks, selectedId]);
    useEffect(() => {
        const timer = setTimeout(() => setStatus((value) => value === 'loading' ? 'error' : value), 15000);
        return () => clearTimeout(timer);
    }, [attempt]);
    function receive(event) {
        // Kortet sender små beskeder tilbage, fx ID'et på den valgte opgave.
        let message;
        try { message = JSON.parse(event.nativeEvent.data); } catch { return; }
        if (message.type === 'mounted') setReady(true);
        if (message.type === 'loaded') setStatus('loaded');
        if (message.type === 'error') setStatus('error');
        if (message.type === 'select' && tasks.some((task) => task.id === message.id)) onSelect(message.id);
    }
    function retry() {
        setReady(false);
        setStatus('loading');
        setAttempt(attempt + 1);
    }
    function navigate({ url }) {
        // Kun attribution åbner en ekstern side. Kortet bliver i appen.
        if (url === 'https://www.openstreetmap.org/copyright' || url.startsWith('https://leafletjs.com')) {
            Linking.openURL(url).catch(() => {});
            return false;
        }
        return url === 'about:blank' || url === source.baseUrl;
    }
    return <View style={styles.container}>
        <WebView key={attempt} ref={webview} source={source} style={styles.webview}
            originWhitelist={['*']} onShouldStartLoadWithRequest={navigate}
            onMessage={receive} onError={() => setStatus('error')}
            applicationNameForUserAgent="SamBud/1.0" scrollEnabled={false} />
        {status !== 'loaded' && <View style={styles.overlay} accessibilityLiveRegion="polite">
            {status === 'loading' ? <><ActivityIndicator color="#2E7D73" /><Text style={styles.message}>Henter kort…</Text></> : <>
                <Text style={styles.message}>Kortet kunne ikke indlæses. Kontrollér din forbindelse, og prøv igen.</Text>
                <Button title="Prøv igen" onPress={retry} />
            </>}
        </View>}
    </View>;
}

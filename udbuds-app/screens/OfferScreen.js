import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useDemo } from '../context/DemoContext';
import DemoStatus, { OfflineNotice } from '../components/DemoStatus';
import { saveOffer } from '../database/demo';
import Button from '../components/ButtonComponent';
import FormField from '../components/FormField';
import { isOpen, parsePrice } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function OfferScreen({ navigation, route }) {
    const { tasks, profile, role, canWrite } = useDemo();
    const task = tasks.find((item) => item.id === route.params?.opportunityId);
    // Et eksisterende bud lægges i felterne, så samme formular kan bruges til redigering.
    const offer = task?.offers[profile?.id];
    const [price, setPrice] = useState(offer ? String(offer.pricePerHousehold).replace('.', ',') : '');
    const [description, setDescription] = useState(offer?.description || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    // Bud er kun mulige fra virksomhedsvisningen på åbne opgaver inden for søgeradius.
    const allowed = role === 'company' && isOpen(task) && task.distance <= profile.radiusMeters;
    async function save() {
        if (!canWrite) return;
        // Lav den danske pris om til et tal, og afvis ugyldige beløb eller tom beskrivelse.
        const amount = parsePrice(price);
        if (!Number.isFinite(amount) || amount <= 0 || amount > 100000 || !description.trim()) {
            setError('Angiv en pris mellem 0,01 og 100.000 kr. med højst to decimaler og beskriv, hvad buddet omfatter.');
            return;
        }
        setError(''); setBusy(true);
        try {
            // Gem en pris pr. husstand; den ændres ikke, når flere naboer tilmelder sig.
            await saveOffer(task.id, profile, amount, description);
            navigation.replace('Virksomheders bud', { opportunityId: task.id });
        } catch { setError('Buddet kunne ikke gemmes. Kontrollér forbindelsen og om opgaven stadig er åben.'); }
        finally { setBusy(false); }
    }
    if (!profile) return <DemoStatus message="Opgaven kunne ikke hentes." />;
    return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{offer ? 'Redigér dit bud' : 'Giv naboerne et bud'}</Text>
            <Text style={styles.heading}>{task?.title || 'Opgaven findes ikke'}</Text>
            <Text style={styles.text}>{task?.participantCount || 0} tilmeldte husstande · fast pris pr. husstand</Text>
            <FormField label="Pris pr. husstand inkl. moms (kr.)" value={price} onChangeText={setPrice}
                keyboardType="decimal-pad" maxLength={10} placeholder="Fx 350,00" />
            <FormField label="Hvad er inkluderet?" value={description} onChangeText={setDescription}
                multiline maxLength={2000} placeholder="Beskriv arbejdet og eventuelle vilkår." />
            {!allowed && <Text style={styles.notice}>Bud kan kun afgives fra virksomhedens side på åbne opgaver i området.</Text>}
            <OfflineNotice />
            {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
            <Button title={offer ? 'Gem ændringer' : 'Send bud'} disabled={!canWrite || !allowed} busy={busy} onPress={save} />
        </ScrollView>
    </KeyboardAvoidingView>;
}

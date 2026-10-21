import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Switch, Text } from 'react-native';
import { useDemo } from '../context/DemoContext';
import { saveTask } from '../database/demo';
import Button from '../components/ButtonComponent';
import FormField from '../components/FormField';
import { dateInput, parseDate, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function AddEditOpportunityScreen({ navigation, route }) {
    const { tasks, profile, role, connected } = useDemo();
    const id = route.params?.opportunityId;
    const task = tasks.find((item) => item.id === id);
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [deadline, setDeadline] = useState(dateInput(task?.deadlineAt || Date.now() + 14 * 86400000));
    const [open, setOpen] = useState(task?.status !== 'closed');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const allowed = role === 'customer' && (!id || task?.ownerId === profile.id);
    async function save() {
        const deadlineAt = parseDate(deadline);
        if (!title.trim() || !description.trim() || !Number.isFinite(deadlineAt) || (open && deadlineAt <= Date.now())) {
            setError('Udfyld titel og beskrivelse, og angiv en gyldig frist. En åben opgave skal have en fremtidig frist.');
            return;
        }
        setError(''); setBusy(true);
        try {
            const opportunityId = await saveTask({
                title: title.trim(), description: description.trim(), deadlineAt, status: open ? 'open' : 'closed',
            }, profile, id);
            navigation.replace('Opgavedetaljer', { opportunityId });
        } catch { setError('Opgaven kunne ikke gemmes. Kontrollér forbindelsen, og prøv igen.'); }
        finally { setBusy(false); }
    }
    return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{id ? 'Redigér din opgave' : 'Invitér naboerne med'}</Text>
            <Text style={styles.text}>{profile.location} · Naboer inden for {formatDistance(profile.radiusMeters)} kan deltage.</Text>
            <FormField label="Titel" value={title} onChangeText={setTitle} maxLength={120} placeholder="Fx fælles vinduespudsning" />
            <FormField label="Beskrivelse" value={description} onChangeText={setDescription} multiline maxLength={2000} placeholder="Hvad skal udføres hos hver husstand?" />
            <FormField label="Frist (ÅÅÅÅ-MM-DD)" value={deadline} onChangeText={setDeadline} maxLength={10} placeholder="2026-12-01" />
            {id && <>
                <Text style={styles.label}>Åben for tilmeldinger og bud</Text>
                <Switch accessibilityLabel="Åben for tilmeldinger og bud" value={open} onValueChange={setOpen} />
            </>}
            {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
            <Button title="Gem opgaven" disabled={!connected || !allowed} busy={busy} onPress={save} />
        </ScrollView>
    </KeyboardAvoidingView>;
}

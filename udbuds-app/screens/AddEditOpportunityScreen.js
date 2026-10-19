import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useOpportunity } from '../context/OpportunitiesContext';
import { databaseErrorMessage, saveOpportunity } from '../database/opportunities';
import { dateInputValue, TASK_STATUSES, validateOpportunityForm } from '../utils/opportunities';
import DatabaseState, { ConnectionNotice } from '../components/DatabaseState';
import ButtonComponent from '../components/ButtonComponent';
import styles from '../styles/DatabaseStyles';

export default function AddEditOpportunityScreen({ navigation, route }) {
    const id = route.params?.opportunityId;
    const data = useOpportunity(id);
    const { user } = useAuth();
    const [form, setForm] = useState({ title: '', location: '', description: '', deadline: dateInputValue(Date.now() + 7 * 86400000), status: 'Åben for bud' });
    const [initialized, setInitialized] = useState(!id);
    const [busy, setBusy] = useState(false);
    const [savedId, setSavedId] = useState(null);
    const [error, setError] = useState('');
    const pending = useRef(false);
    usePreventRemove(busy, () => {});
    useEffect(() => {
        if (id && data.opportunity && !initialized) {
            const task = data.opportunity;
            setForm({ title: task.title, location: task.location, description: task.description, deadline: dateInputValue(task.deadlineAt), status: task.status });
            setInitialized(true);
        }
    }, [id, data.opportunity, initialized]);
    useEffect(() => {
        if (savedId && !busy) {
            if (id) navigation.goBack();
            else navigation.replace('OpgaveStack', { screen: 'Opgavedetaljer', params: { opportunityId: savedId } });
        }
    }, [savedId, busy, id, navigation]);

    if (data.loading || data.error || (id && !data.opportunity)) return <DatabaseState {...data} missing={id && !data.opportunity} />;
    if (id && data.opportunity.ownerId !== user.uid) return <DatabaseState error="Kun opretteren kan redigere opgaven." retry={() => navigation.goBack()} />;
    const change = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));
    const save = async () => {
        if (pending.current) return;
        const validation = validateOpportunityForm(form);
        setError(validation);
        if (validation) return;
        pending.current = true;
        setBusy(true);
        try { setSavedId(await saveOpportunity(form, id)); }
        catch (failure) { setError(databaseErrorMessage(failure)); }
        finally { pending.current = false; setBusy(false); }
    };
    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>{id ? 'Redigér fælles opgave' : 'Hvad skal I have lavet?'}</Text>
                <Text style={styles.text}>{id ? 'Tilpas beskrivelsen, eller vælg Lukket for at stoppe nye tilmeldinger.' : 'Beskriv opgaven, så andre kan vurdere, om de vil være med. Du tilmeldes automatisk som opretter.'}</Text>
                <ConnectionNotice connected={data.connected} />
                <Text style={styles.label}>Titel</Text>
                <TextInput style={styles.input} value={form.title} onChangeText={(value) => change('title', value)} maxLength={120} editable={!busy} accessibilityLabel="Titel" />
                <Text style={styles.label}>Vej eller område</Text>
                <TextInput style={styles.input} value={form.location} onChangeText={(value) => change('location', value)} maxLength={120} editable={!busy} accessibilityLabel="Vej eller område" />
                <Text style={styles.label}>Beskrivelse</Text>
                <TextInput style={[styles.input, styles.multiline]} value={form.description} onChangeText={(value) => change('description', value)} maxLength={3000} multiline editable={!busy} accessibilityLabel="Beskrivelse" />
                <Text style={styles.label}>Tilmeldingsfrist (ÅÅÅÅ-MM-DD)</Text>
                <TextInput style={styles.input} value={form.deadline} onChangeText={(value) => change('deadline', value)} maxLength={10} autoCorrect={false} editable={!busy} accessibilityLabel="Tilmeldingsfrist" />
                <Text style={styles.label}>Status</Text>
                {TASK_STATUSES.filter((status) => id || status !== 'Lukket').map((status) => (
                    <Pressable key={status} style={[styles.statusOption, form.status === status && styles.selected]}
                        onPress={() => change('status', status)} disabled={busy} accessibilityRole="radio" accessibilityState={{ checked: form.status === status, disabled: busy }}>
                        <Text style={styles.statusText}>{status}</Text>
                    </Pressable>
                ))}
                {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
                {busy && <Text style={styles.text}>Gemmer… Vent på bekræftelsen, før du forlader skærmen.</Text>}
                <ButtonComponent title={id ? 'Gem ændringer' : 'Opret og tilmeld'} onPress={save} busy={busy} disabled={!data.connected || !initialized || !!savedId} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

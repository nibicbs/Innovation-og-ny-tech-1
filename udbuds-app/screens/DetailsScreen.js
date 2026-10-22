import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import { joinTask } from '../database/demo';
import Button from '../components/ButtonComponent';
import DemoStatus, { OfflineNotice } from '../components/DemoStatus';
import { canJoin, isOpen, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function DetailsScreen({ navigation, route }) {
    const { tasks, role, profile, canWrite } = useDemo();
    // Den forrige skærm sender kun et ID. Resten hentes fra de fælles opgaver.
    const task = tasks.find((item) => item.id === route.params?.opportunityId);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    if (!profile) return <DemoStatus message="Opgaven kunne ikke hentes." />;
    if (!task) return <View style={styles.center}><Text>Opgaven findes ikke længere.</Text></View>;
    // Disse værdier afgør, hvilke handlinger den aktive profil får vist.
    const joined = Boolean(task.participants[profile.id]);
    const owner = task.ownerId === profile.id;
    const open = isOpen(task);
    const params = { opportunityId: task.id };

    let joinLabel = 'Tilmeld min husstand';
    if (joined) joinLabel = 'Afmeld husstanden';
    if (owner) joinLabel = 'Din husstand er tilmeldt';

    // Vis ventestatus under gemning; databaselytteren opdaterer derefter deltagerantallet.
    async function toggleJoin() {
        if (!canWrite) return;
        setBusy(true);
        setError('');
        try {
            await joinTask(task.id, profile, joined);
        } catch {
            setError('Tilmeldingen kunne ikke ændres. Prøv igen, mens opgaven er åben.');
        } finally {
            setBusy(false);
        }
    }
    // Tilmelding kræver forbindelse og en åben opgave inden for radius.
    // Opretteren er altid tilmeldt; virksomheden får i stedet knappen til at afgive bud.
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.accent}>{open ? 'ÅBEN FOR BUD' : 'LUKKET'}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.text}>{task.description}</Text>
        <View style={styles.card}>
            <Text style={styles.text}>Oprettet af {task.ownerName}</Text>
            <Text style={styles.text}>{task.location} · {formatDistance(task.distance)} fra dig</Text>
            <Text style={styles.text}>Frist: {new Date(task.deadlineAt).toLocaleDateString('da-DK')}</Text>
            <Text style={styles.text}>{task.participantCount} tilmeldte husstande</Text>
            <Text style={styles.small}>Tilmeldingsradius: {formatDistance(task.radiusMeters)} fra opgaven.</Text>
        </View>
        <OfflineNotice />
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        {role === 'customer' && <>
            {!joined && !canJoin(task, profile) && <Text style={styles.notice}>{open
                ? 'Din adresse ligger uden for opgavens tilmeldingsradius.'
                : 'Opgaven er lukket for nye tilmeldinger.'}</Text>}
            <Button title={joinLabel}
                disabled={!canWrite || owner || (!joined && !canJoin(task, profile))} busy={busy} onPress={toggleJoin} />
            {owner && <Button title="Redigér opgaven" disabled={!canWrite} onPress={() => navigation.navigate('OpretRedigerOpgave', params)} />}
        </>}
        {role === 'company' && <Button title={task.offers[profile.id] ? 'Redigér mit bud' : 'Afgiv bud pr. husstand'}
            disabled={!canWrite || !open || task.distance > profile.radiusMeters}
            onPress={() => navigation.navigate('Afgiv bud', params)} />}
        <Button variant="secondary" title={`Tilmeldte husstande · ${task.participantCount}`}
            onPress={() => navigation.navigate('Tilmeldte naboer', params)} />
        <Button variant="secondary" title={`Virksomheders bud · ${task.offerCount}`}
            onPress={() => navigation.navigate('Virksomheders bud', params)} />
    </ScrollView>;
}

import { ScrollView, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import DatabaseState, { ConnectionNotice } from '../components/DatabaseState';
import { useOpportunity } from '../context/OpportunitiesContext';
import { useAuth } from '../context/AuthContext';
import { databaseErrorMessage, setParticipation } from '../database/opportunities';
import { canJoinOpportunity, formatDeadline } from '../utils/opportunities';
import styles from '../styles/DetailsScreenStyles';
import dbStyles from '../styles/DatabaseStyles';

export default function DetailsScreen({ navigation, route }) {
    const opportunityId = route.params?.opportunityId;
    const data = useOpportunity(opportunityId);
    const { opportunity } = data;
    const { user } = useAuth();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [now, setNow] = useState(Date.now());
    const pending = useRef(false);
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(timer);
    }, []);

    if (data.loading || data.error || !opportunity) return <DatabaseState {...data} missing={!opportunity} />;
    const joined = opportunity.isUserParticipating;
    const canJoin = canJoinOpportunity(opportunity, now);
    const hasOffer = opportunity.offers.length > 0;
    const count = opportunity.participants.length;
    // Den hidtidige demo-beregning bevares, indtil prisgrundlaget er afklaret.
    const costPerHousehold = count > 0 ? opportunity.expectedCost / count : 0;
    const toggleParticipation = async () => {
        if (pending.current) return;
        pending.current = true;
        setBusy(true);
        setError('');
        try { await setParticipation(opportunityId, !joined); }
        catch (failure) { setError(databaseErrorMessage(failure)); }
        finally { pending.current = false; setBusy(false); }
    };
    return (
        <ScrollView style={dbStyles.screen} contentContainerStyle={dbStyles.body}>
            <Text style={styles.eyebrow}>FÆLLES OPGAVE</Text>
            <Text style={styles.title}>{opportunity.title}</Text>
            <Text style={styles.text}>{opportunity.location} går sammen om én samlet opgave.</Text>
            {!!opportunity.description && <Text style={styles.text}>{opportunity.description}</Text>}
            <Text style={styles.detail}>{opportunity.status} · {formatDeadline(opportunity.deadlineAt, now)}</Text>
            <ConnectionNotice connected={data.connected} />
            {opportunity.isDemo && <Text style={dbStyles.demo}>Eksempelopgave. Tilbud og {opportunity.demoParticipantCount} naboer er demonstrationsdata; din egen tilmelding gemmes på din konto.</Text>}
            <View style={styles.summary}>
                <View style={styles.summaryItem}><Text style={styles.summaryValue}>{count}</Text><Text style={styles.summaryLabel}>tilmeldte naboer</Text></View>
                <View style={styles.summaryItem}><Text style={styles.summaryValue}>{hasOffer ? `${opportunity.expectedCost.toLocaleString('da-DK')} kr.` : 'Afventer pris'}</Text><Text style={styles.summaryLabel}>samlet pris</Text></View>
                <View style={styles.summaryItem}><Text style={styles.summaryValue}>{hasOffer ? `${costPerHousehold.toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.` : 'Afventer pris'}</Text><Text style={styles.summaryLabel}>pr. husstand</Text></View>
            </View>
            {!!error && <Text style={dbStyles.error} accessibilityRole="alert">{error}</Text>}
            <ButtonComponent onPress={toggleParticipation} busy={busy} disabled={!data.connected || (!joined && !canJoin)}
                title={joined ? 'Afmeld opgaven' : canJoin ? 'Tilmeld opgaven' : 'Tilmelding lukket'} />
            {opportunity.ownerId === user.uid && <ButtonComponent title="Redigér opgave" disabled={busy || !data.connected}
                onPress={() => navigation.navigate('OpretRedigerOpgave', { opportunityId })} />}
            <Text style={styles.question}>Hvad vil du se?</Text>
            <ButtonComponent title="Tilmeldte naboer" onPress={() => navigation.navigate('Tilmeldte naboer', { opportunityId })} />
            <ButtonComponent title="Virksomheders bud" onPress={() => navigation.navigate('Virksomheders bud', { opportunityId })} />
        </ScrollView>
    );
}

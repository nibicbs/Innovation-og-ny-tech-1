import { Text, View } from 'react-native';
import { useState } from 'react';
import ButtonComponent from '../components/ButtonComponent';
import styles from '../styles/DetailsScreenStyles';

const navController = (navigation, route, opportunity) => {
    // Hjælpefunktion til navigation fra de to knapper.
    navigation.navigate(route, { opportunity });
};

export default function DetailsScreen({ navigation, route }) {
    // Den valgte opgave sendes med fra opgavelisten.
    const opportunity = route.params?.opportunity;
    // Startværdien viser, om brugeren allerede er tilmeldt opgaven.
    const initialJoined = opportunity?.isUserParticipating || false;
    const [isJoined, setIsJoined] = useState(initialJoined);
    const hasOffer = Boolean(opportunity?.offers?.length);
    const baseParticipatingCount = opportunity?.participatingNeighbors?.length || 0;
    // Tilmelding ændrer deltagerantallet, som bruges til at beregne prisen pr. husstand.
    const participationChange = isJoined === initialJoined ? 0 : isJoined ? 1 : -1;
    const participatingCount = baseParticipatingCount + participationChange;
    const expectedCost = opportunity?.expectedCost || 0;
    const costPerHousehold = participatingCount > 0
        ? expectedCost / participatingCount
        : 0;

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>FÆLLES OPGAVE</Text>
            <Text style={styles.title}>
                {opportunity?.title || 'Vinduespudsning på villavejen'}
            </Text>
            <Text style={styles.text}>
                {opportunity
                    ? `${opportunity.location} går sammen om én samlet opgave.`
                    : '10 huse på Solvænget går sammen om én samlet opgave.'}
            </Text>
            <Text style={styles.detail}>
                Inden for 1 km · {opportunity?.deadline || 'Frist om 5 dage'}
            </Text>
            <View style={styles.summary}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{participatingCount}</Text>
                    <Text style={styles.summaryLabel}>tilmeldte naboer</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                        {hasOffer ? `${expectedCost.toLocaleString('da-DK')} kr.` : 'Afventer pris'}
                    </Text>
                    <Text style={styles.summaryLabel}>samlet pris</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                        {hasOffer
                            ? `${costPerHousehold.toLocaleString('da-DK', {
                                maximumFractionDigits: 0,
                            })} kr.`
                            : 'Afventer pris'}
                    </Text>
                    <Text style={styles.summaryLabel}>pr. husstand</Text>
                </View>
            </View>
            <ButtonComponent
                onPress={() => setIsJoined((currentValue) => !currentValue)}
                title={isJoined ? 'Afmeld opgaven' : 'Tilmeld opgaven'}
            />
            <Text style={styles.question}>Hvad vil du se?</Text>
            <ButtonComponent
                onPress={() => navController(navigation, 'Tilmeldte naboer', opportunity)}
                title="Tilmeldte naboer"
            />
            <ButtonComponent
                onPress={() => navController(navigation, 'Virksomheders bud', opportunity)}
                title="Virksomheders bud"
            />
        </View>
    );
}

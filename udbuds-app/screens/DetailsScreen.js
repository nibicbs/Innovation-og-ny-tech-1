import { Text, View } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import styles from '../styles/DetailsScreenStyles';

const navController = (navigation, route, opportunity) => {
    // Hjælpefunktion til navigation fra de to knapper.
    navigation.navigate(route, { opportunity });
};

export default function DetailsScreen({ navigation, route }) {
    // Den valgte opgave sendes med fra opgavelisten.
    const opportunity = route.params?.opportunity;

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
            <Text style={styles.question}>Hvad vil du se?</Text>
            <ButtonComponent
                onPress={() => navController(navigation, 'Naboernes bidrag', opportunity)}
                title="Naboernes bidrag"
            />
            <ButtonComponent
                onPress={() => navController(navigation, 'Virksomheders bud')}
                title="Virksomheders bud"
            />
        </View>
    );
}

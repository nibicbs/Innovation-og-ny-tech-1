import { ScrollView, Text, View } from 'react-native';
import styles from '../../styles/AppDetailsScreenStyles';

export default function AppDetailsScreen({ route }) {
    const offers = route.params?.opportunity?.offers || [];
    const sortedOffers = [...offers].sort(
        (firstOffer, secondOffer) => firstOffer.discountedPrice - secondOffer.discountedPrice,
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={styles.eyebrow}>VIRKSOMHEDERS BUD</Text>
            {sortedOffers.length > 0 ? (
                <>
                    <Text style={styles.title}>Modtagne tilbud</Text>
                    <Text style={styles.text}>
                        Tilbuddene er sorteret efter pris, så det billigste vises først.
                    </Text>
                    {sortedOffers.map((offer, index) => (
                        <View style={styles.offerCard} key={offer.company}>
                            <Text style={styles.title}>{offer.company}</Text>
                            <Text style={styles.offerCount}>
                                {index + 1} ud af {sortedOffers.length} tilbud
                            </Text>
                            {index === 0 && (
                                <Text style={styles.cheapestNote}>Billigste tilbud</Text>
                            )}
                            <Text style={styles.description}>{offer.description}</Text>
                            <Text style={styles.offerLabel}>Normalpris</Text>
                            <Text style={styles.originalPrice}>
                                {offer.originalPrice.toLocaleString('da-DK')} kr.
                            </Text>
                            <Text style={styles.offerLabel}>Pris med mængderabat</Text>
                            <Text style={styles.discountedPrice}>
                                {offer.discountedPrice.toLocaleString('da-DK')} kr.
                            </Text>
                            <Text style={styles.discountText}>
                                I sparer {(
                                    offer.originalPrice - offer.discountedPrice
                                ).toLocaleString('da-DK')} kr., fordi flere husstande går sammen.
                            </Text>
                        </View>
                    ))}
                </>
            ) : (
                <>
                    <Text style={styles.title}>Afventer tilbud</Text>
                    <Text style={styles.text}>
                        Der er endnu ikke modtaget et tilbud fra en virksomhed på denne opgave.
                    </Text>
                </>
            )}
        </ScrollView>
    );
}

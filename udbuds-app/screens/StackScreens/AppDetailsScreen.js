import { ScrollView, Text, View } from 'react-native';
import styles from '../../styles/AppDetailsScreenStyles';
import { useOpportunity } from '../../context/OpportunitiesContext';
import DatabaseState, { ConnectionNotice } from '../../components/DatabaseState';
import dbStyles from '../../styles/DatabaseStyles';

export default function AppDetailsScreen({ route }) {
    const data = useOpportunity(route.params?.opportunityId);
    if (data.loading || data.error || !data.opportunity) return <DatabaseState {...data} missing={!data.opportunity} />;
    const offers = data.opportunity.offers;
    const sortedOffers = [...offers].sort(
        (firstOffer, secondOffer) => firstOffer.discountedPrice - secondOffer.discountedPrice,
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={styles.eyebrow}>VIRKSOMHEDERS BUD</Text>
            <ConnectionNotice connected={data.connected} />
            {data.opportunity.isDemo && <Text style={dbStyles.demo}>Tilbuddene er eksempler fra den første prototype.</Text>}
            {sortedOffers.length > 0 ? (
                <>
                    <Text style={styles.title}>Modtagne tilbud</Text>
                    <Text style={styles.text}>
                        Tilbuddene er sorteret efter pris, så det billigste vises først.
                    </Text>
                    {sortedOffers.map((offer, index) => (
                        <View style={styles.offerCard} key={offer.id}>
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

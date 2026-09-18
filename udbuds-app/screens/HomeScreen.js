import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, Text, View } from 'react-native';
import { opportunities } from '../data/opportunities';
import styles from '../styles/HomeScreenStyles';

export default function HomeScreen({ navigation }) {
    // Demoens bruger bor på denne vej og er derfor allerede tilmeldt opgaven.
    const userStreet = 'Solvænget';

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>SAMMEN I NÆROMRÅDET</Text>
            <Text style={styles.title}>Fælles opgaver</Text>
            <Text style={styles.intro}>
                Saml naboerne, og få virksomheder til at byde på opgaven.
            </Text>
            <View style={styles.listContainer}>
                <FlatList
                    // Listen viser de fælles opgaver i nærområdet.
                    data={opportunities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.item, item.location === userStreet && styles.joinedItem]}
                            // Tryk på en opgave for at se flere detaljer.
                            onPress={() =>
                                navigation.navigate('OpgaveStack', {
                                    screen: 'Opgavedetaljer',
                                    params: { opportunity: item },
                                })
                            }
                        >
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                {item.location === userStreet && (
                                    <Text style={styles.joinedLabel}>DU ER TILMELDT</Text>
                                )}
                            </View>
                            <Text style={styles.itemMeta}>{item.location}</Text>
                            <View style={styles.itemFooter}>
                                <Text style={styles.status}>{item.status}</Text>
                                <Text style={styles.deadline}>{item.deadline}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

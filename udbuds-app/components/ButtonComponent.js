import { Pressable, Text } from 'react-native';
import styles from '../styles/ButtonComponentStyles';

export default function ButtonComponent({ title, onPress }) {
    // Genbrugelig knap til navigation mellem opgavens undersider.
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

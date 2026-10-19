import { ActivityIndicator, Pressable, Text } from 'react-native';
import styles from '../styles/ButtonComponentStyles';

export default function ButtonComponent({ title, onPress, disabled = false, busy = false }) {
    // Genbrugelig knap til navigation mellem opgavens undersider.
    return (
        <Pressable style={[styles.button, (disabled || busy) && styles.disabled]} onPress={onPress}
            disabled={disabled || busy} accessibilityRole="button" accessibilityLabel={title}
            accessibilityState={{ disabled: disabled || busy, busy }}>
            {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.text}>{title}</Text>}
        </Pressable>
    );
}

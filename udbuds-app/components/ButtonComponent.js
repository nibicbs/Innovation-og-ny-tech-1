import { ActivityIndicator, Pressable, Text } from 'react-native';
import styles from '../styles/ButtonComponentStyles';

export default function ButtonComponent({ title, onPress, disabled = false, busy = false, variant = 'primary' }) {
    // Genbrugelig knap til navigation mellem opgavens undersider.
    return (
        <Pressable style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondary, pressed && styles.pressed, (disabled || busy) && styles.disabled]} onPress={onPress}
            disabled={disabled || busy} accessibilityRole="button" accessibilityLabel={title}
            accessibilityState={{ disabled: disabled || busy, busy }}>
            {busy ? <ActivityIndicator color={variant === 'secondary' ? '#17324D' : '#FFFFFF'} /> : <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>}
        </Pressable>
    );
}

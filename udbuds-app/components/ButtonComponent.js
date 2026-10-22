import { ActivityIndicator, Pressable, Text } from 'react-native';
import styles from '../styles/ButtonComponentStyles';

export default function ButtonComponent({ title, onPress, disabled = false, busy = false, variant = 'primary' }) {
    // Den fælles knap bruges både til navigation og til at gemme formularer.
    // Under gemning vises en spinner, og flere tryk er slået fra.
    const secondary = variant === 'secondary';
    const inactive = disabled || busy;
    const buttonStyles = ({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && styles.pressed,
        inactive && styles.disabled,
    ];

    let content = <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>;
    if (busy) {
        content = <ActivityIndicator color={secondary ? '#17324D' : '#FFFFFF'} />;
    }

    return (
        <Pressable
            style={buttonStyles}
            onPress={onPress}
            disabled={inactive}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: inactive, busy }}>
            {content}
        </Pressable>
    );
}

import { Text, TextInput } from 'react-native';
import styles from '../styles/DemoStyles';

// Samler label og tekstfelt. De øvrige indstillinger sendes videre til TextInput.
export default function FormField({ label, multiline, ...props }) {
    return <>
        <Text style={styles.label}>{label}</Text>
        <TextInput accessibilityLabel={label} style={[styles.input, multiline && styles.multiline]}
            multiline={multiline} placeholderTextColor="#76838D" {...props} />
    </>;
}

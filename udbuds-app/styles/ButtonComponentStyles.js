import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.75 },
    secondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE1DF' },
    secondaryText: { color: '#17324D' },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: '#10344A',
        marginTop: 14,
        marginBottom: 14,
        width: '100%',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

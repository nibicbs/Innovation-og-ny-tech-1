import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F2EA',
    },
    content: { padding: 24, paddingTop: 36, paddingBottom: 48 },
    account: { flex: 1 },
    logoutButton: { borderWidth: 1, borderColor: '#17324D', borderRadius: 10, padding: 16, marginTop: 24, alignItems: 'center', minHeight: 52 },
    logoutText: { color: '#17324D', fontSize: 16, fontWeight: '700' },
    disabled: { opacity: 0.5 },
    error: { color: '#A52A2A', fontSize: 14, lineHeight: 21, marginTop: 16 },
    eyebrow: {
        color: '#2E7D73',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        color: '#17324D',
        fontSize: 30,
        fontWeight: '700',
        marginTop: 8,
    },
    text: {
        color: '#53616D',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
    },
    settingsList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 28,
        width: '100%',
    },
    settingRow: {
        alignItems: 'center',
        borderBottomColor: '#E7EBEC',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 72,
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    settingLabel: {
        color: '#17324D',
        fontSize: 16,
        fontWeight: '700',
    },
    settingValue: {
        color: '#53616D',
        fontSize: 14,
        marginTop: 4,
    },
});

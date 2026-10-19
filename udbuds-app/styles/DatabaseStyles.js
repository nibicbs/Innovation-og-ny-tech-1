import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    state: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F2EA' },
    text: { fontSize: 16, lineHeight: 24, color: '#53616D', marginTop: 12 },
    error: { fontSize: 15, lineHeight: 22, color: '#A52A2A', marginTop: 12 },
    notice: { backgroundColor: '#FFF4D8', color: '#70531B', borderRadius: 8, padding: 12, marginVertical: 12, lineHeight: 21 },
    demo: { color: '#70531B', fontSize: 13, lineHeight: 20, marginTop: 12 },
    empty: { paddingVertical: 24, color: '#53616D', fontSize: 16, lineHeight: 24 },
    actions: { marginBottom: 20 },
    body: { padding: 24, paddingBottom: 48 },
    screen: { flex: 1, backgroundColor: '#F6F2EA' },
    title: { fontSize: 28, color: '#17324D', fontWeight: '700', marginBottom: 12 },
    label: { color: '#17324D', fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 8 },
    input: { backgroundColor: '#FFFFFF', color: '#17324D', borderColor: '#BCC9D0', borderWidth: 1, borderRadius: 10, fontSize: 16, padding: 14, minHeight: 50 },
    multiline: { minHeight: 120, textAlignVertical: 'top' },
    statusOption: { borderColor: '#BCC9D0', borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 8, backgroundColor: '#FFFFFF' },
    selected: { borderColor: '#2E7D73', borderWidth: 2, backgroundColor: '#E8F3F0' },
    statusText: { color: '#17324D', fontSize: 15 },
});

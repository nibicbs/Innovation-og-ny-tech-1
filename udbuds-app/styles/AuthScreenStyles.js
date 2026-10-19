import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F2EA' },
    flex: { flex: 1 },
    content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 36, width: '100%', maxWidth: 520, alignSelf: 'center' },
    eyebrow: { color: '#2E7D73', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    brand: { color: '#17324D', fontSize: 36, fontWeight: '700', marginTop: 8 },
    intro: { color: '#53616D', fontSize: 16, lineHeight: 24, marginTop: 12, marginBottom: 28 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 22 },
    title: { color: '#17324D', fontSize: 24, fontWeight: '700' },
    subtitle: { color: '#53616D', fontSize: 15, lineHeight: 22, marginTop: 8 },
    label: { color: '#17324D', fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#BCC9D0', borderRadius: 10, backgroundColor: '#FAFBFC', color: '#17324D', fontSize: 16, paddingHorizontal: 14, paddingVertical: 14, minHeight: 50 },
    primaryButton: { backgroundColor: '#17324D', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, minHeight: 52 },
    primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    secondaryButton: { padding: 14, marginTop: 6, minHeight: 48, justifyContent: 'center' },
    secondaryText: { color: '#2E7D73', fontSize: 15, fontWeight: '600', textAlign: 'center' },
    disabled: { opacity: 0.5 },
    error: { color: '#A52A2A', fontSize: 14, lineHeight: 21, marginTop: 16 },
    notice: { backgroundColor: '#FFF4D8', color: '#70531B', borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 21, marginTop: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F6F2EA' },
});

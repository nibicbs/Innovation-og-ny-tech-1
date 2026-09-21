import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F2EA',
        padding: 24,
        paddingTop: 36,
    },
    eyebrow: {
        color: '#2E7D73',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    title: {
        color: '#17324D',
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
        marginTop: 8,
    },
    text: {
        color: '#53616D',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
    },
    detail: {
        color: '#2E7D73',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 18,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
    },
    summaryItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        width: '31.5%',
    },
    summaryValue: {
        color: '#17324D',
        fontSize: 18,
        fontWeight: '700',
    },
    summaryLabel: {
        color: '#53616D',
        fontSize: 13,
        marginTop: 6,
    },
    question: {
        color: '#17324D',
        fontSize: 17,
        fontWeight: '700',
        marginTop: 42,
    },
});

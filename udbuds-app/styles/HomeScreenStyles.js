import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F2EA',
        padding: 20,
        paddingTop: 28,
    },
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
        marginTop: 6,
    },
    intro: {
        color: '#53616D',
        fontSize: 16,
        lineHeight: 23,
        marginTop: 8,
        marginBottom: 20,
    },
    listContainer: {
        flex: 1,
        width: '100%',
    },
    item: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        shadowColor: '#17324D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    joinedItem: {
        borderColor: '#2E7D73',
        borderWidth: 2,
    },
    itemHeader: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    itemTitle: {
        color: '#17324D',
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
    },
    joinedLabel: {
        color: '#2E7D73',
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'right',
    },
    itemMeta: {
        color: '#53616D',
        fontSize: 14,
        marginTop: 6,
    },
    itemFooter: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    status: {
        color: '#2E7D73',
        fontSize: 13,
        fontWeight: '700',
    },
    deadline: {
        color: '#7A8791',
        fontSize: 13,
    },
});

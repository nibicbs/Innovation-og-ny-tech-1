import React from 'react';
import { Text, View } from 'react-native';

const FirstComponent = () => {
    return (
        <View style={{ backgroundColor: 'red', marginBottom: 10 }}>
            <Text>Dette er den første komponent</Text>
        </View>
    );
};

export default FirstComponent;
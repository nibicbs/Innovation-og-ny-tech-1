import React from 'react';
import { Image, View } from 'react-native';

const AssetComponent = ({ url }) => {
    return (
        <View>
            <Image source={url} style={{ width: 100, height: 100 }} />
        </View>
    );
};

export default AssetComponent;
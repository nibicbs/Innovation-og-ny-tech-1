import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const InputComponent = () => {
    const [inputValue, setInputValue] = useState('');

    return (
        <View>
            <TextInput
                placeholder="Skriv noget her!!"
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                style={{ backgroundColor: 'white', padding: 8, minWidth: 180 }}
            />
            <Text>Du skrev: {inputValue}</Text>
        </View>
    );
};

export default InputComponent;
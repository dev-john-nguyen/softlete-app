import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import PrimaryText from './elements/PrimaryText';
import { normalize } from '../utils/tools';
import Colors from '../utils/BaseColors';

interface Props {
    onPress: () => void;
    backgroundColor: string;
    color: string;
    text: string;
}

const Selection = ({ onPress, backgroundColor, text, color }: Props) => {
    return (
        <Pressable style={[styles.container, { backgroundColor }, Colors.primaryBoxShadow]} onPress={onPress}>
            <PrimaryText styles={[styles.text, { color }]}>{text}</PrimaryText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    text: {
        fontSize: normalize.width(15)
    }
})
export default Selection;
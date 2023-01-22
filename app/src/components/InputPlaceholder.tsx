import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import BaseColors from '../utils/BaseColors';
import SecondaryText from './elements/SecondaryText';
import StyleConstants from './tools/StyleConstants';


interface Props {
    onPress: () => void;
    value: string;
    label: string;
    style?: StyleProp<any>
}


const InputPlaceholder = ({ onPress, value, label, style }: Props) => {
    return (
        <View style={[styles.container, style]}>
            <SecondaryText styles={styles.label}>{label}</SecondaryText>
            <Pressable onPress={onPress} style={styles.valueContainer}>
                <SecondaryText styles={styles.value}>{value}</SecondaryText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    valueContainer: {
        padding: 15,
        backgroundColor: BaseColors.white,
        borderRadius: StyleConstants.borderRadius,
        borderWidth: 1,
        borderColor: BaseColors.lightGrey,
    },
    label: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.lightBlack,
        marginBottom: StyleConstants.smallMargin,
    },
    value: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginRight: StyleConstants.smallMargin,
    },
})
export default InputPlaceholder;
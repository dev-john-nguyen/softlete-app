import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants from '../../tools/StyleConstants';


interface Props {
    label: string;
    value: string;
    svg: React.ReactElement<any, any>;
    onPress?: () => void;
}


const AthleteProfileItem = ({ label, value, svg, onPress }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.svg}>
                {svg}
            </View>
            <SecondaryText styles={styles.label}>{label}</SecondaryText>
            <SecondaryText styles={styles.value} bold>{value}</SecondaryText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: StyleConstants.borderRadius,
        borderColor: BaseColors.darkGrey,
        margin: 5,
        padding: 15,
        paddingRight: 20,
        paddingLeft: 20,
        flex: 1,
        backgroundColor: BaseColors.white
    },
    svg: {
        height: normalize.width(25),
        width: normalize.width(25),
        marginBottom: 5
    },
    label: {
        textTransform: 'capitalize',
        color: BaseColors.lightBlack,
        fontSize: StyleConstants.extraSmallFont,
        marginBottom: 5
    },
    value: {
        color: BaseColors.black,
        fontSize: StyleConstants.smallFont,
    }
})
export default AthleteProfileItem;
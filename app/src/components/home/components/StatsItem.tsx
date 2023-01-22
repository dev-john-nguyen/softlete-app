import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants from '../../tools/StyleConstants';
import LinearGradient from 'react-native-linear-gradient';
import { HomeBoxShadow } from '../types';

interface Props {
    num: string;
    label: string;
    meas: string;
    svg: React.ReactElement<any, any>;
    topLeftSvg?: React.ReactElement<any, any>;
    topRightSvg?: React.ReactElement<any, any>;
    onPress?: () => void;
}


const StatsItem = ({ num, label, svg, topLeftSvg, topRightSvg, onPress, meas }: Props) => {
    return (
        <Pressable onPress={onPress}>
            <LinearGradient colors={['rgba(122,0,0,.8)', 'rgba(122,0,0,.5)']} style={styles.container}>
                <View style={styles.tlSvg}>
                    {topLeftSvg}
                </View>
                <View style={styles.trSvg}>
                    {topRightSvg}
                </View>
                <View style={styles.svg}>
                    {svg}
                </View>
                <SecondaryText styles={styles.label}>{label}</SecondaryText>
                <View style={styles.valueContainer}>
                    <SecondaryText styles={styles.text} bold>{num}</SecondaryText>
                    <SecondaryText styles={styles.meas}>{meas}</SecondaryText>
                </View>
            </LinearGradient>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: StyleConstants.baseMargin,
        marginTop: StyleConstants.smallMargin,
        marginBottom: StyleConstants.smallMargin,
        borderRadius: 5,
        alignSelf: 'flex-start',
        alignItems: 'center',
        ...HomeBoxShadow
    },
    label: {
        color: BaseColors.lightWhite,
        fontSize: StyleConstants.extraSmallFont,
        marginTop: 5
    },
    text: {
        color: BaseColors.lightWhite,
        fontSize: StyleConstants.mediumFont
    },
    svg: {
        width: normalize.width(15),
        height: normalize.width(15),
    },
    meas: {
        color: BaseColors.lightWhite,
        fontSize: StyleConstants.extraSmallFont,
        marginLeft: 5
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10
    },
    tlSvg: {
        width: normalize.width(25),
        height: normalize.width(25),
        position: 'absolute',
        top: 5,
        left: 5
    },
    trSvg: {
        width: normalize.width(25),
        height: normalize.width(25),
        position: 'absolute',
        top: 5,
        right: 5
    }
})
export default StatsItem;
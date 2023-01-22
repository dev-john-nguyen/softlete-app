import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import PencilSvg from '../../../assets/PencilSvg';
import BaseColors, { rgba } from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import PrimaryText from '../../elements/PrimaryText';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants, { moderateScale } from '../../tools/StyleConstants';


interface Props {
    svg: React.ReactElement<any, any>;
    onPress?: () => void;
    label: string;
    text: any;
    edit?: boolean;
    topRight?: React.ReactElement<any, any>;
}


const HealthItem = ({ onPress, svg, label, text, edit, topRight }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.svg}>
                {svg}
            </View>
            <SecondaryText styles={styles.label}>{label}</SecondaryText>
            <PrimaryText styles={styles.text}>{text}</PrimaryText>
            {edit && (
                <View style={styles.topRight}>
                    <PencilSvg fillColor={BaseColors.white} />
                </View>
            )}
            {
                topRight && <View style={styles.topRight}>
                    {topRight}
                </View>
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: rgba(BaseColors.whiteRbg, .7),
        borderWidth: 1,
        padding: StyleConstants.baseMargin,
        borderRadius: StyleConstants.borderRadius,
        marginRight: StyleConstants.smallMargin,
        shadowColor: BaseColors.lightPrimary,
        shadowOffset: {
            width: 5,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: 'flex-start'
    },
    svg: {
        width: moderateScale(20),
        height: moderateScale(20),
        marginBottom: StyleConstants.smallMargin
    },
    label: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.lightWhite,
        marginRight: StyleConstants.smallMargin,
        marginBottom: StyleConstants.smallMargin,
        opacity: .7,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite,
        letterSpacing: 1,
        textTransform: 'capitalize'
    },
    topRight: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: 100,
        padding: 5,
        position: 'absolute',
        top: 5,
        right: 5,
        opacity: .5
    }
})
export default HealthItem;

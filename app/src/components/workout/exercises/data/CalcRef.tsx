import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import PrimaryText from '../../../elements/PrimaryText';
import StyleConstants from '../../../tools/StyleConstants';
import Input from '../../../elements/Input';
import CalcSvg from '../../../../assets/CalcSvg';
import BaseColors, { rgba } from '../../../../utils/BaseColors';
import { normalize, strToFloat } from '../../../../utils/tools';
import InfoSvg from '../../../../assets/InfoSvg';
import SecondaryText from '../../../elements/SecondaryText';


interface Props {
    calcRef: number | undefined;
    onCalcRefUpdate: (calc: string | number) => void;
}


const CalcRef = ({ onCalcRefUpdate, calcRef }: Props) => {
    const [info, setInfo] = useState(false);

    const onCalcRefInputChange = (calcStr: string) => {
        const calc = strToFloat(calcStr);
        onCalcRefUpdate(calc)
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: .6, alignItems: 'center', marginRight: 5 }}>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={styles.infoContainer}>
                    {info && (
                        <Pressable style={styles.infoTextContainer} onPress={() => setInfo(false)}>
                            <SecondaryText styles={styles.infoText}>This number multiply by col 4 populates col 3.</SecondaryText>
                        </Pressable>
                    )}
                    <Pressable style={styles.infoSvg} hitSlop={5} onPress={() => setInfo(i => i ? false : true)}>
                        <InfoSvg fillColor={rgba(BaseColors.lightWhiteRgb, .5)} />
                    </Pressable>
                </View>

                <View style={styles.svg}>
                    <CalcSvg strokeColor={rgba(BaseColors.lightWhiteRgb, .5)} />
                </View>
                <Input
                    value={calcRef ? calcRef.toString() : '0'}
                    onChangeText={onCalcRefInputChange}
                    placeholder='0'
                    numbers={true}
                    keyboardType='numeric'
                    styles={styles.input}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
        textAlign: 'center'
    },
    svg: {
        width: normalize.width(15),
        height: normalize.width(15),
        position: 'absolute',
        top: '25%',
        left: '-5%',
        zIndex: 99
    },
    infoSvg: {
        width: normalize.width(20),
        height: normalize.width(20),
    },
    infoContainer: {
        position: 'absolute',
        top: '-10%',
        right: '-3%',
        zIndex: 100,
        flexDirection: 'row'
    },
    infoTextContainer: {
        padding: 5,
        backgroundColor: BaseColors.white,
        borderRadius: StyleConstants.borderRadius,
    },
    infoText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black
    }
})
export default CalcRef;
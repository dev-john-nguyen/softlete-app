import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StyleConstants from '../../../tools/StyleConstants';
import BaseColors from '../../../../utils/BaseColors';
import Fonts from '../../../../utils/Fonts';
import SecondaryText from '../../../elements/SecondaryText';
import { normalize } from '../../../../utils/tools';
import FormContainer from './FormContainer';

interface Props {
    onDurationUpdate: (num: number) => void;
    renderBack: any;
}


const DurationForm = ({ onDurationUpdate, renderBack }: Props) => {
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);


    const onSave = () => {
        const ms = (hours * 60 * 60 + mins * 60) * 1000;
        onDurationUpdate(ms)
    }

    return (
        <FormContainer
            renderBack={renderBack}
            title='Duration'
            onSave={onSave}
        >
            <View style={{ flex: 1 }}>
                <SecondaryText styles={styles.label}>Hours</SecondaryText>
                <Picker
                    style={styles.pickerStyle}
                    itemStyle={styles.itemStyle}
                    enabled={false}
                    selectedValue={hours}
                    onValueChange={(itemValue: number) => setHours(itemValue)}
                >
                    {new Array(24).fill('').map((_, i) => (
                        <Picker.Item value={i} key={i} label={i.toString()} />
                    ))}
                </Picker>
            </View>
            <View style={{ flex: 1, marginLeft: StyleConstants.baseMargin }}>
                <SecondaryText styles={styles.label}>Minutes</SecondaryText>
                <Picker
                    style={styles.pickerStyle}
                    itemStyle={styles.itemStyle}
                    enabled={false}
                    selectedValue={mins}
                    onValueChange={(itemValue: number) => setMins(itemValue)}
                >
                    {new Array(60).fill('').map((_, i) => (
                        <Picker.Item value={i} key={i} label={i.toString()} />
                    ))}
                </Picker>
            </View>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    pickerStyle: {
        width: '100%',
        borderRadius: StyleConstants.borderRadius,
        borderColor: BaseColors.white,
        borderWidth: 1
    },
    itemStyle: {
        fontSize: StyleConstants.smallMediumFont,
        fontFamily: Fonts.secondary,
        color: BaseColors.white,
        textTransform: 'capitalize',
        height: normalize.height(15)
    },
    label: {
        fontSize: StyleConstants.extraSmallFont,
        marginBottom: 10,
        color: BaseColors.lightWhite
    }
})
export default DurationForm;
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StyleConstants from '../../../tools/StyleConstants';
import BaseColors from '../../../../utils/BaseColors';
import Fonts from '../../../../utils/Fonts';
import SecondaryText from '../../../elements/SecondaryText';
import { normalize } from '../../../../utils/tools';
import { capitalize } from 'lodash';
import Input from '../../../elements/Input';
import { HealthDisMeas } from '../../../../services/workout/types';
import FormContainer from './FormContainer';

interface Props {
    onMeasChange: (txt: HealthDisMeas) => void;
    meas: string;
    onChangeDistance: (txt: string) => void;
    distance: string;
    disPlaceHolder: string;
    renderBack: any
}


const MeasForm = ({ onMeasChange, meas, onChangeDistance, distance, disPlaceHolder, renderBack }: Props) => {
    const [newDis, setNewDis] = useState(distance);

    const onSave = () => onChangeDistance(newDis);

    return (
        <FormContainer
            title='Distance'
            onSave={onSave}
            renderBack={renderBack}
        >
            <View style={{ flex: 1, marginRight: 5 }}>
                <SecondaryText styles={styles.label}>Miles</SecondaryText>
                <Input
                    value={newDis}
                    onChangeText={(val) => setNewDis(val)}
                    styles={{ marginBottom: StyleConstants.smallMargin }}
                    placeholder={disPlaceHolder}
                    keyboardType='numeric'
                    maxLength={4}
                />
            </View>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: StyleConstants.smallFont,
        marginBottom: 10,
        color: BaseColors.lightWhite,
    },
    title: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.black,
        marginRight: StyleConstants.smallMargin,
        marginBottom: StyleConstants.smallMargin
    }
})
export default MeasForm;
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StyleConstants from '../../../tools/StyleConstants';
import BaseColors from '../../../../utils/BaseColors';
import SecondaryText from '../../../elements/SecondaryText';
import Input from '../../../elements/Input';
import FormContainer from './FormContainer';

interface Props {
    onChange: (txt: string) => void;
    value: string;
    placeholder: string;
    title: string;
    label: string;
    renderBack: any
}


const BaseForm = ({ onChange, value, placeholder, title, label, renderBack }: Props) => {
    const [newValue, setNewValue] = useState(value)

    const onSave = () => onChange(newValue)

    return (
        <FormContainer
            title={title}
            onSave={onSave}
            renderBack={renderBack}
        >
            <View style={styles.container}>
                <SecondaryText styles={styles.label}>{label}</SecondaryText>
                <Input
                    value={newValue}
                    onChangeText={(val) => setNewValue(val)}
                    placeholder={placeholder}
                    keyboardType='numeric'
                    maxLength={5}
                />
            </View>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: StyleConstants.baseMargin,
        flex: 1
    },
    label: {
        fontSize: StyleConstants.smallFont,
        marginBottom: 10,
        color: BaseColors.lightWhite,
        textTransform: 'capitalize'
    },
})
export default BaseForm;
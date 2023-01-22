import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';


interface Props {

}


const ProgramHelp = ({ }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>Access Codes</SecondaryText>
                <SecondaryText styles={styles.text}>You can generate access codes by visiting the program menu and then access codes. Access codes can be used to give authorized users access to your program.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>Program Image</SecondaryText>
                <SecondaryText styles={styles.text}>You can add/update a program image by visiting the program menu and then edit program details.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>Generating Programs</SecondaryText>
                <SecondaryText styles={styles.text}>You can generate a program by taping on the download icon underneath the header image. The program will auto generate on your calendar based on the selected start date.</SecondaryText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    section: {
        marginBottom: StyleConstants.smallMargin
    },
    label: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginBottom: 2,
        textTransform: 'capitalize'
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    }
})
export default ProgramHelp;
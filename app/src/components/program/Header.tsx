import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgramProps } from '../../services/program/types';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { ScrollView } from 'react-native-gesture-handler';
import { normalize } from '../../utils/tools';


interface Props {
    name: ProgramProps['name'];
    description: ProgramProps['description'];
}


const ProgramHeader = ({ name, description }: Props) => {
    return (
        <View style={styles.container}>
            <PrimaryText styles={styles.name}>{name}</PrimaryText>
            <ScrollView style={styles.desContainer}>
                <SecondaryText styles={styles.des}>{description}</SecondaryText>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StyleConstants.smallMargin,
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
        marginBottom: StyleConstants.baseMargin
    },
    name: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.lightWhite,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginBottom: 5
    },
    des: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.lightWhite,
        opacity: .9,
        textAlign: 'center'
    },
    desContainer: {
        maxHeight: normalize.height(25)
    }
})

export default ProgramHeader;
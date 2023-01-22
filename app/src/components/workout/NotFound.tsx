import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StyleConstants from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';
import BaseColors from '../../utils/BaseColors';


interface Props {

}


const NotFound = ({ }: Props) => {
    return (
        <View style={styles.container}>
            <SecondaryText styles={styles.text} bold={true}>Not Found</SecondaryText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary
    }
})
export default NotFound;
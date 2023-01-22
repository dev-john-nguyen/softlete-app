import React from 'react';
import { View, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';


interface Props {

}


const Empty = ({ }: Props) => {
    return (
        <View style={styles.container}>
            <PrimaryText styles={styles.text}>No Data</PrimaryText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    text: {
        fontSize: StyleConstants.smallFont,
        textTransform: 'uppercase',
        color: BaseColors.white
    }
})
export default Empty;
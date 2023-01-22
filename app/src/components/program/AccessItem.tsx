import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import TrashSvg from '../../assets/TrashSvg';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';


interface Props {
    text: string;
    onLongPress: (txt: string) => void;
    edit: boolean;
}


const ProgramAccessItem = ({ text, onLongPress, edit }: Props) => {
    return (
        <Pressable style={styles.container} onLongPress={() => onLongPress(text)}>
            <SecondaryText>{text}</SecondaryText>
            {edit && (
                <View style={styles.svg}>
                    <TrashSvg fillColor={BaseColors.primary} />
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: StyleConstants.smallMargin,
        backgroundColor: BaseColors.lightGrey,
        padding: 10,
        borderRadius: StyleConstants.borderRadius,
        justifyContent: 'space-between'
    },
    svg: {
        width: normalize.width(25),
        height: normalize.width(25)
    }
})
export default ProgramAccessItem;
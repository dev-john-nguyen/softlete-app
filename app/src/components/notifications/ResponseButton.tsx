import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';


interface Props {
    text: string;
    onPress?: () => void;
    primary?: boolean;
}


const ResponseButton = ({ onPress, text, primary }: Props) => {
    return (
        <Pressable style={[styles.button, {
            backgroundColor: primary ? BaseColors.primary : 'transparent'
        }]} onPress={onPress} hitSlop={5}>
            <SecondaryText styles={[styles.buttonText, {
                color: primary ? BaseColors.white : BaseColors.lightBlack
            }]}>{text}</SecondaryText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: StyleConstants.borderRadius,
        marginTop: StyleConstants.smallMargin,
        borderColor: BaseColors.lightGrey,
        marginLeft: 10,
        borderWidth: .5
    },
    buttonText: {
        fontSize: StyleConstants.extraSmallFont
    },
})
export default ResponseButton;
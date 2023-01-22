import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import BaseColors from '../../../utils/BaseColors';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants from '../../tools/StyleConstants';


interface Props {
    text: string;
    onPress?: () => void;
}


const ProfileButton = ({ onPress, text }: Props) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <SecondaryText styles={styles.buttonText}>{text}</SecondaryText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        width: '45%',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: StyleConstants.borderRadius,
        marginTop: StyleConstants.smallMargin,
        borderColor: BaseColors.lightGrey,
        borderWidth: .5,
    },
    buttonText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightBlack,
    },
})
export default ProfileButton;
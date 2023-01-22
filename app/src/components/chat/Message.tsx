import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';


interface Props {
    isUser: boolean;
    message: string;
}


const ChatMessage = ({ isUser, message }: Props) => {
    return (
        <View style={[styles.container, {
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            backgroundColor: isUser ? BaseColors.white : BaseColors.primary,
            borderWidth: .5,
            borderColor: isUser ? BaseColors.lightGrey : BaseColors.lightPrimary,
            maxWidth: '80%',
        }]}>
            <SecondaryText
                styles={[styles.message, {
                    color: isUser ? BaseColors.black : BaseColors.white
                }]}
            >{message}</SecondaryText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 100,
        padding: 15,
        paddingLeft: 20,
        paddingRight: 20,
        margin: StyleConstants.smallMargin,
        flexWrap: 'wrap'
    },
    message: {
        fontSize: StyleConstants.smallFont
    }
})
export default React.memo(ChatMessage);
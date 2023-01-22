import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Keyboard } from 'react-native';
import Input from '../elements/Input';
import StyleConstants from '../tools/StyleConstants';
import { normalize } from '../../utils/tools';
import BaseColors, { rgba } from '../../utils/BaseColors';
import SendSvg from '../../assets/SendSvg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';


interface Props {
    onSendMessage: (msg: string) => void;
}


const MessageInput = ({ onSendMessage }: Props) => {
    const [msg, setMsg] = useState('');
    const [keyBH, setKeyBH] = useState(0)

    useEffect(() => {

        const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyBH(e.endCoordinates.height)
        })

        const hideSub = Keyboard.addListener('keyboardWillHide', (e) => {
            setKeyBH(0)
        })

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: '100%',
            height: withTiming(keyBH)
        }
    }, [keyBH])

    const onSubmit = () => {
        if (!msg) return;
        onSendMessage(msg)
        setMsg('')
    }
    return (
        <SafeAreaView edges={['bottom']}>
            <View style={styles.container}>
                <Input
                    onChangeText={txt => setMsg(txt)}
                    value={msg}
                    styles={styles.input}
                    placeholder='Type your message ...'
                    multiline
                />
                <Pressable style={styles.send} onPress={onSubmit} >
                    <View style={styles.svg}>
                        <SendSvg fillColor={BaseColors.white} />
                    </View>
                </Pressable>
            </View>
            <Animated.View style={animatedStyles} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopColor: BaseColors.lightGrey,
        borderTopWidth: 1,
        backgroundColor: BaseColors.lightWhite,
        flexDirection: 'row',
        paddingTop: StyleConstants.baseMargin
    },
    send: {
        alignSelf: 'flex-end',
        marginRight: StyleConstants.baseMargin,
        backgroundColor: BaseColors.primary,
        borderRadius: StyleConstants.borderRadius,
        padding: 15,
        paddingRight: 20,
        paddingLeft: 20
    },
    svg: {
        height: normalize.width(20),
        width: normalize.width(20),
    },
    input: {
        maxHeight: normalize.height(10) * 2,
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.smallMargin,
        flex: 1
    }
})
export default MessageInput;
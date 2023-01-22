import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import Input from './Input';
import SecondaryText from './SecondaryText';


interface Props {
    value: string;
    setValue: (txt: string) => void;
    onSubmitEditing: () => void;
    type: string;
    label: string;
    onHide: () => void;
    maxLength: number;
    multiline: boolean;
}


const KeyboardInput = ({ value, setValue, onSubmitEditing, type, label, onHide, ...inputProps }: Props) => {
    const _keyboardHeight = useSharedValue(0);
    const [keyboardShow, setKeyboardShow] = useState(false);
    const ref: any = useRef();

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
            _keyboardHeight.value = e.endCoordinates.height
            setKeyboardShow(true)
        })

        const hideSub = Keyboard.addListener('keyboardWillHide', (e) => {
            setKeyboardShow(false)
            onHide()
        })

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    useLayoutEffect(() => {
        if (!type) {
            Keyboard.dismiss()
        } else {
            if (ref.current) {
                ref.current.focus()
            }
        }
    }, [type])


    const animatedStyles = useAnimatedStyle(() => {
        return {
            bottom: keyboardShow ? _keyboardHeight.value : -100,
            position: 'absolute',
            backgroundColor: BaseColors.lightWhite,
            paddingLeft: StyleConstants.baseMargin,
            paddingRight: StyleConstants.baseMargin,
            paddingTop: StyleConstants.smallMargin,
            paddingBottom: StyleConstants.smallMargin,
            width: '100%',
            opacity: keyboardShow ? withDelay(50, withTiming(1)) : 0,
            borderTopColor: BaseColors.lightGrey,
            borderTopWidth: 1
        }
    }, [keyboardShow])

    return (
        <Animated.View style={animatedStyles}>
            <SecondaryText styles={styles.label}>{label}</SecondaryText>
            <Input
                value={value}
                onChangeText={setValue}
                onSubmitEditing={onSubmitEditing}
                inputRef={ref}
                blurOnSubmit={false}
                {...inputProps}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    label: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginBottom: 10,
        textTransform: 'capitalize'
    },
})
export default KeyboardInput;
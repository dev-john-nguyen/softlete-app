import React from 'react';
import { Pressable, StyleSheet, View, StyleProp, Keyboard } from 'react-native';
import BaseColors from '../utils/BaseColors';
import MenuSvg from '../assets/MenuSvg';
import { normalize } from '../utils/tools';

interface Props {
    onPress: () => void;
    style?: StyleProp<any>
    menuColor?: string;
}

const HeaderMenu = ({ onPress, style, menuColor }: Props) => {

    const handleOnPress = () => {
        Keyboard.dismiss()
        onPress()
    }

    return (
        <Pressable onPress={handleOnPress} style={[style]} hitSlop={20}>
            <View style={styles.menu}>
                <MenuSvg strokeColor={menuColor ? menuColor : BaseColors.lightWhite} />
            </View>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    menu: {
        height: normalize.width(25),
        width: normalize.width(25),
    }
})

export default HeaderMenu;

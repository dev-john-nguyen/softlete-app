import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { normalize } from '../../utils/tools';


interface Props {
    index: number;
    curGroup: number;
    onPress: () => void;
    color: string;
    lightColor: string;
}

const activeWidth = normalize.width(20)
const inactiveWidth = normalize.width(30)

const NavbarItem = ({ index, curGroup, onPress, color, lightColor }: Props) => {

    const animatedStyles = useAnimatedStyle(() => {
        const active = (curGroup * 30) === index * 30 ? true : false;
        return {
            backgroundColor: active ? withTiming(color) : withTiming(lightColor),
            height: active ? withTiming(activeWidth) : withTiming(inactiveWidth),
            width: active ? withTiming(activeWidth) : withTiming(inactiveWidth),
            borderRadius: 100,
            marginRight: 20
        }
    }, [curGroup, color])

    return (
        <Pressable style={styles.container} onPress={onPress} hitSlop={5}>
            <Animated.View key={index} style={animatedStyles} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: normalize.width(20),
        justifyContent: 'center'
    }
})
export default NavbarItem;
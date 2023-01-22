import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Chevron from '../../assets/ChevronSvg';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';


interface Props {
    pos: StyleProp<any>
}


const DemoArrow = ({ pos }: Props) => {
    const sharedValue = useSharedValue(0);

    useEffect(() => {
        sharedValue.value = withRepeat(
            withSequence(withTiming(5), withTiming(0)),
            -1,
            true,
            (finished) => {
                const resultStr = finished
                    ? 'All repeats are completed'
                    : 'withRepeat cancelled';
                console.log(resultStr);
            }
        );
    }, [])

    const animatedStyles = useAnimatedStyle(() => {
        return {
            top: pos.top,
            left: pos.left,
            transform: [...pos.transform, { translateX: sharedValue.value }]
        }
    }, [pos])

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <Chevron strokeColor={BaseColors.primary} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: normalize.width(12),
        width: normalize.width(12),
        position: 'absolute',
        zIndex: 10000
    }
})
export default DemoArrow;
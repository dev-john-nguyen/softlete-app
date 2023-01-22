import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BaseColors, { rgba } from '../../utils/BaseColors';
import CheckedSvg from '../../assets/CheckedSvg';


interface Props {
    onPress?: () => void;
    checked?: boolean;
}


const CircleCheck = ({ onPress, checked }: Props) => {
    return (
        <Pressable
            style={({ pressed }) => [styles.container, {
                backgroundColor: pressed ? rgba(BaseColors.greenRbg, .5) : checked ? BaseColors.green : 'transparent',
                borderColor: pressed ? rgba(BaseColors.greenRbg, .7) : checked ? BaseColors.green : BaseColors.secondary
            }]}
            onPress={onPress}
            hitSlop={5}
        >
            {({ pressed }) => (
                (checked || pressed) &&
                <View style={styles.check}>
                    <CheckedSvg strokeColor={BaseColors.white} />
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        zIndex: 1000
    },
    check: {
        width: '40%'
    }
})
export default CircleCheck;
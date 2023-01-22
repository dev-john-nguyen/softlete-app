import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { normalize } from '../../utils/tools';
import { moderateScale } from '../tools/StyleConstants';

interface Props {
    icon: any
    onPress: () => void
    active: boolean
}


const Tab = ({ icon, onPress, active }: Props) => {


    return (
        <Pressable style={styles.container} onPress={onPress} hitSlop={10}>
            {icon}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: moderateScale(25),
        height: moderateScale(25),
        zIndex: 100
    }
})
export default Tab;
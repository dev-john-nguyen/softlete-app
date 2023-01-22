import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Chevron from '../../../assets/ChevronSvg';
import BaseColors from '../../../utils/BaseColors';
import StyleConstants, { moderateScale } from '../../tools/StyleConstants';


interface Props {
    onPress: () => void
}

const HomeMore = ({ onPress }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress} hitSlop={10}>
            <Chevron strokeColor={BaseColors.white} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: StyleConstants.baseMargin,
        marginTop: moderateScale(20),
        alignSelf: 'flex-start',
        height: moderateScale(30),
        width: moderateScale(30),
        borderColor: BaseColors.white,
        borderWidth: 1,
        borderRadius: 100,
        padding: 10,
        transform: [{ rotate: '-90deg' }]
    }
})
export default HomeMore;
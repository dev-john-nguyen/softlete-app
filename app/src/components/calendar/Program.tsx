import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ProgramProps } from '../../services/program/types';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import ProgramHeaderImage from '../program/HeaderImage';
import LockSvg from '../../assets/LockSvg';
import { normalize } from '../../utils/tools';

interface Props {
    program: ProgramProps;
    onNavToProgram: (program: ProgramProps) => void;
    lock?: boolean;
}


const DashboardProgramView = ({ program, onNavToProgram, lock }: Props) => {

    const onPress = () => onNavToProgram(program);

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            {
                lock && <View style={styles.lockContainer}>
                    <View style={styles.lock}>
                        <LockSvg fillColor={BaseColors.primary} />
                    </View>
                </View>
            }
            <View style={styles.content}>
                <View>
                    <SecondaryText styles={styles.name} bold={true} numberOfLines={2}>{program.name}</SecondaryText>
                    <SecondaryText styles={styles.description} numberOfLines={4}>{program.description}</SecondaryText>
                </View>
            </View>
            <ProgramHeaderImage uri={program.imageUri} onPress={onPress} container={styles.image} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: StyleConstants.borderRadius,
        borderLeftColor: BaseColors.primary,
        width: '100%',
        flexDirection: 'row',
        marginBottom: StyleConstants.baseMargin,
        borderLeftWidth: 10,
        minHeight: normalize.height(8),
        maxHeight: normalize.height(6),
        backgroundColor: BaseColors.white,
        borderColor: BaseColors.lightGrey,
        borderWidth: .2,
        ...BaseColors.lightBoxShadow
    },
    name: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary,
        textTransform: 'capitalize'
    },
    description: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    },
    content: {
        padding: StyleConstants.baseMargin,
        flex: 1,
    },
    image: {
        flex: 1,
        borderTopRightRadius: StyleConstants.borderRadius,
        borderBottomRightRadius: StyleConstants.borderRadius
    },
    lockContainer: {
        position: 'absolute',
        zIndex: 100,
        top: 5,
        right: 10,
        flexDirection: 'row',
        backgroundColor: BaseColors.white,
        padding: 5,
        borderRadius: 100
    },
    lock: {
        height: normalize.width(30),
        width: normalize.width(30)
    }
})
export default DashboardProgramView;
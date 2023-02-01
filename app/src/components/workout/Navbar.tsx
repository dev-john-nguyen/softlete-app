import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { normalize } from '../../utils/tools';
import { WorkoutStatus } from '../../services/workout/types';
import NavbarItem from './NavbarItem';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PlusSvg from '../../assets/PlusSvg';
import StyleConstants from '../tools/StyleConstants';

interface Props {
    groupKeys: number[];
    onGroupPress: (key: number) => void;
    curGroup: number;
    onAddExercise: (newGroup: boolean) => void;
    status: WorkoutStatus;
    athlete?: boolean;
}

//I know the width
//How to determine the pos and overlap 

const WorkoutNavbar = ({ groupKeys, onGroupPress, curGroup, onAddExercise, status, athlete }: Props) => {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            horizontal
        >
            <View style={styles.groupContainer}>
                {
                    status === WorkoutStatus.completed && (
                        <View style={styles.reflect} />
                    )
                }
                {groupKeys.map((g, index) => <NavbarItem
                    index={index}
                    curGroup={curGroup}
                    key={index}
                    onPress={() => curGroup === g ? onAddExercise(false) : onGroupPress(g)}
                    color={status === WorkoutStatus.completed ? BaseColors.green : BaseColors.white}
                    lightColor={status === WorkoutStatus.completed ? rgba(BaseColors.greenRbg, .5) : rgba(BaseColors.whiteRbg, .5)}
                />)}
                {
                    status === WorkoutStatus.inProgress && (
                        <View style={styles.reflect} />
                    )
                }
                {
                    (!athlete && status !== WorkoutStatus.completed) && (
                        <Pressable style={styles.plus} onPress={() => onAddExercise(true)}>
                            <PlusSvg strokeColor={BaseColors.white} />
                        </Pressable>
                    )
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: normalize.width(2),
        height: '100%',
    },
    contentContainerStyle: {
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plus: {
        height: normalize.width(15),
        width: normalize.width(15),
        borderRadius: 100,
        padding: 8,
        backgroundColor: BaseColors.primary
    },
    reflect: {
        height: normalize.width(25),
        width: normalize.width(25),
        borderRadius: 100,
        borderColor: BaseColors.green,
        borderWidth: 1,
        marginRight: StyleConstants.baseMargin
    }
})
export default WorkoutNavbar;
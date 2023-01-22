import React, { Dispatch, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import BaseColors from '../../../utils/BaseColors';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../../utils/tools';
import PrimaryText from '../../../components/elements/PrimaryText';
import PencilSvg from '../../../assets/PencilSvg';
import SecondaryText from '../../../components/elements/SecondaryText';
import SortSvg from '../../../assets/SortSvg';
import TrashSvg from '../../../assets/TrashSvg';
import InfoSvg from '../../../assets/InfoSvg';
import { ReducerProps } from '../../../services';
import { connect } from 'react-redux';
import { removeProgramWorkout } from '../../../services/program/actions';
import { removeWorkout } from '../../../services/workout/actions';
import { INITIATE_WORKOUT_HEADER } from '../../../services/workout/actionTypes';
import { HomeStackScreens } from '../types';
import { ProgramActionProps } from '../../../services/program/types';
import { ViewWorkoutProps, WorkoutActionProps, WorkoutTypes } from '../../../services/workout/types';
import PrimaryButton from '../../../components/elements/PrimaryButton';
import SecondaryButton from '../../../components/elements/SecondaryButton';
import WorkoutHelp from '../../../components/modal/WorkoutHelp';
import Chevron from '../../../assets/ChevronSvg';
import CloseSvg from '../../../assets/CloseSvg';
import styles from '../../../components/modal/styles';

interface Props {
    navigation: any;
    route: any;
    dispatch: React.Dispatch<any>;
    removeWorkout: WorkoutActionProps['removeWorkout'];
    removeProgramWorkout: ProgramActionProps['removeProgramWorkout'];
    workout: ViewWorkoutProps;
}


const WorkoutModal = ({ navigation, workout, route, removeProgramWorkout, removeWorkout, dispatch }: Props) => {
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [help, setHelp] = useState(false);
    const mount = useRef(false);
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        mount.current = true;
        return () => {
            mount.current = false;
        }
    }, [])

    const onEditWorkoutHeader = () => {
        if (!workout) return;

        const isProgram = route.params ? route.params.isProgram : false;

        dispatch({
            type: INITIATE_WORKOUT_HEADER,
            payload: {
                ...workout,
                program: isProgram
            }
        })

        navigation.navigate(HomeStackScreens.WorkoutHeader, { goBackScreen: HomeStackScreens.Workout })
    }

    const onDeleteWorkout = () => {
        if (!workout) return;
        setLoading(true)
        removeWorkout(workout._id)
            .then(() => mount.current && navigation.navigate(HomeStackScreens.Home))
            .catch((err) => {
                console.log(err)
                if (mount.current) {
                    navigation.navigate(HomeStackScreens.Home)
                    setLoading(false)
                }
            })
    }

    const onRestructure = () => navigation.navigate(HomeStackScreens.ReorderWorkoutExercises)


    const renderContent = () => {
        if (confirm) return (
            <View>
                <SecondaryText styles={styles.label}>Are you sure you want to remove?</SecondaryText>
                <View style={styles.confirmActions}>
                    <PrimaryButton onPress={onDeleteWorkout}>Confirm</PrimaryButton>
                    <SecondaryButton onPress={() => setConfirm(false)}>Cancel</SecondaryButton>
                </View>
            </View>
        )

        if (help) return <WorkoutHelp />

        return (
            <View>
                <Pressable style={styles.item} onPress={onEditWorkoutHeader}>
                    <SecondaryText styles={styles.label}>Edit</SecondaryText>
                    <View style={styles.svg}>
                        <PencilSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                {
                    workout.type === WorkoutTypes.TraditionalStrengthTraining && (
                        <Pressable style={styles.item} onPress={onRestructure}>
                            <SecondaryText styles={styles.label}>Restructure</SecondaryText>
                            <View style={styles.svg}>
                                <SortSvg fillColor={BaseColors.primary} />
                            </View>
                        </Pressable>
                    )
                }
                <Pressable style={styles.item} onPress={() => setHelp(true)}>
                    <SecondaryText styles={styles.label}>Tips/Help</SecondaryText>
                    <View style={styles.svg}>
                        <InfoSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={styles.item} onPress={() => setConfirm(true)}>
                    <SecondaryText styles={styles.label}>Remove</SecondaryText>
                    <View style={styles.svg}>
                        <TrashSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={styles.item} onPress={() => navigation.goBack()}>
                    <SecondaryText styles={styles.label}>Cancel</SecondaryText>
                    <View style={{ height: normalize.width(30), width: normalize.width(30) }}>
                        <CloseSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>
            </View>
        )
    }

    const renderHeader = () => {
        if (confirm) return 'Confirm'
        if (help) return 'Tips/Help'
        return 'Menu'
    }

    const onBack = () => {
        setConfirm(false)
        setHelp(false)
    }

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <Pressable onPress={() => navigation.goBack()} style={styles.closeContainer} />
            <View style={[styles.content, { marginTop: headerHeight }]}>
                <View style={styles.modal}>
                    <View style={styles.headerContainer}>
                        {
                            (confirm || help) ? (
                                <Pressable style={styles.backContainer} onPress={onBack}>
                                    <Chevron strokeColor={BaseColors.black} />
                                </Pressable>
                            ) :
                                <View />
                        }
                        <PrimaryText styles={styles.title}>{renderHeader()}</PrimaryText>
                        <View />
                    </View>
                    {
                        loading && (
                            <ActivityIndicator size='small' color={BaseColors.primary} style={styles.loading} />
                        )
                    }
                    {renderContent()}
                </View>
            </View>
        </SafeAreaView >
    )
}

const mapStateToProps = (state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        removeWorkout: async (workoutUid: string) => dispatch(removeWorkout(workoutUid)),
        removeProgramWorkout: async (workoutUid: string) => dispatch(removeProgramWorkout(workoutUid)),
        dispatch
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(WorkoutModal);
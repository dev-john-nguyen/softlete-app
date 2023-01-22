import React, { useEffect, useState, Dispatch, useCallback, useLayoutEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { WorkoutStatus, ViewWorkoutProps, WorkoutTypes } from '../../services/workout/types';
import BaseColors, { rgba } from '../../utils/BaseColors';
import { ExerciseProps } from '../../services/exercises/types';
import WorkoutContainer from '../../components/workout/Container';
import { GeneratedProgramProps } from '../../services/program/types';
import WorkoutHeader from '../../components/workout/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkStackScreens } from './types';
import Loading from '../../components/elements/Loading';
import StyleConstants from '../../components/tools/StyleConstants';
import { normalize } from '../../utils/tools';
import { likeWorkout } from '../../services/athletes/actions';
import { AthleteActionProps } from '../../services/athletes/types';
import { UserProps } from '../../services/user/types';
import OverviewContainer from '../../components/workout/overview/Container';
import ErrorSvg from '../../assets/ErrorSvg';
import reportWo from '../utils/report-wo';

interface Props {
    workout: ViewWorkoutProps;
    route: any;
    navigation: any;
    dispatch: React.Dispatch<any>;
    genPrograms: GeneratedProgramProps[];
    likedWoIds: string[];
    likeWorkout: AthleteActionProps['likeWorkout'];
    user: UserProps;
}

//notes
///route params will determine if it's a new workout

const AthleteWorkout = ({ route, navigation, dispatch, workout, genPrograms, likedWoIds, likeWorkout, user }: Props) => {
    const [loading, setLoading] = useState(false);
    const [program, setProgram] = useState<GeneratedProgramProps>();
    const [isProgramTemplate, setIsProgramTemplate] = useState(false);

    const handleInitiateWorkout = useCallback(async () => {
        if (workout) {
            //find generated program
            const foundProgram = genPrograms.find(p => p._id === workout.programUid);
            if (foundProgram) {
                setProgram(foundProgram)
            } else {
                setProgram(undefined)
            }

            setLoading(false);
        }
    }, [workout, genPrograms])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={styles.menu} onPress={onReportWo}>
                    <ErrorSvg fillColor={BaseColors.black} />
                </Pressable>
            ),
        })
    }, [workout])

    useEffect(() => {
        handleInitiateWorkout()
    }, [workout])

    useEffect(() => {
        if (route.params && route.params.isProgram) {
            setIsProgramTemplate(true)
        } else {
            setIsProgramTemplate(false)
        }
    }, [route])

    const onNavigateToExercise = (exercise: ExerciseProps) => {
        navigation.navigate(NetworkStackScreens.AthleteExercise, { exercise })
    }

    const onReportWo = () => reportWo(workout.userUid, workout._id)

    const isLiked = () => {
        if (!workout || !workout.likeUids) return false;

        if (likedWoIds.find(id => id === workout._id) || workout.likeUids.find(id => id === user.uid)) {
            return true
        }
        return false
    }

    const onLikePress = () => !isLiked() && likeWorkout(workout._id)

    if (!workout || loading) return <Loading />

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            {
                workout.type === WorkoutTypes.TraditionalStrengthTraining ?
                    <WorkoutContainer
                        isProgramTemplate={isProgramTemplate}
                        workout={workout}
                        onNavigateToExercise={onNavigateToExercise}
                        navigation={navigation}
                        athlete
                    /> :
                    <OverviewContainer
                        navigation={navigation}
                        workout={workout}
                        athlete
                    />
            }
            <WorkoutHeader
                likeUids={workout.likeUids ? workout.likeUids : []}
                workout={workout}
                program={program}
                onLikePress={onLikePress}
                isLiked={isLiked()}
                athlete
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginTop: StyleConstants.baseMargin,
        zIndex: 0,
    },
    likeNum: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary,
        marginLeft: 5
    },
    heart: {
        width: normalize.width(15),
        height: normalize.width(15)
    },
    heartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: '2%',
        top: '-10%',
        zIndex: 100,
        borderRadius: 100,
        flexDirection: 'row',
        padding: 10
    },
    menu: {
        width: normalize.width(20),
        height: normalize.width(20),
        marginRight: StyleConstants.baseMargin
    },
})

const mapStateToProps = (state: ReducerProps) => ({
    user: state.user,
    workout: state.athletes.viewWorkout,
    genPrograms: state.athletes.generatedPrograms,
    likedWoIds: state.athletes.likedWoIds
})


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        likeWorkout: async (workoutUid: string) => dispatch(likeWorkout(workoutUid)),
        dispatch
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AthleteWorkout);
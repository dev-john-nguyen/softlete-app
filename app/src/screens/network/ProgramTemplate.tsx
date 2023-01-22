import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { ProgramActionProps, ProgramHeaderProps, ProgramByWeekProps, ProgramProps } from '../../services/program/types';
import { setTargetProgram, setProgramViewWorkout, generateProgram } from '../../services/program/actions';
import ProgramHeader from '../../components/program/Header';
import BaseColors from '../../utils/BaseColors';
import ProgramWorkouts from '../../components/program/Workouts';
import { AppDispatch } from '../../../App';
import StyleConstants from '../../components/tools/StyleConstants';
import { programWorkoutsArrToObj, normalize } from '../../utils/tools';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import DownloadSvg from '../../assets/DownloadSvg';
import { NetworkStackScreens } from './types';
import _ from 'lodash';
import Loading from '../../components/elements/Loading';
import { UserProps } from '../../services/user/types';
import { likeProgram } from '../../services/athletes/actions';
import { AthleteActionProps } from '../../services/athletes/types';


interface Props {
    navigation: any;
    route: any;
    setProgramViewWorkout: ProgramActionProps['setProgramViewWorkout'];
    dispatch: AppDispatch;
    programProps?: ProgramProps;
    likedProgramUids: string[];
    user: UserProps;
    likeProgram: AthleteActionProps['likeProgram']
}


const AthleteProgramTemplate = ({ route, navigation, dispatch, setProgramViewWorkout, programProps, likedProgramUids, user, likeProgram }: Props) => {
    const [workoutsObj, setWorkoutsObj] = useState<ProgramByWeekProps>({});
    const [lock, setLock] = useState(false);
    const mount = useRef(false);

    const initProgram = useCallback(async () => {
        if (!programProps) return navigation.goBack()

        if (programProps.workouts) {
            setWorkoutsObj(programWorkoutsArrToObj(programProps.workouts));
        } else {
            setWorkoutsObj({})
        }

        setLock(programProps.isPrivate)
    }, [programProps])

    useEffect(() => {
        mount.current = true;
        initProgram()
        return () => {
            mount.current = false;
        }
    }, [programProps])

    const navToViewWorkout = (workoutUid: string) => {
        //fetch the exercises before navigating to viewWorkout
        if (!workoutUid || !programProps) return;
        setProgramViewWorkout(workoutUid, programProps._id, true)
            .then(() => {
                navigation.navigate(NetworkStackScreens.AthleteWorkout, { isProgram: true })
            })
            .catch((err) => console.log(err))
    }

    const onDownload = () => navigation.navigate(NetworkStackScreens.DownloadProgramModal)

    if (!programProps) return <Loading />

    const isLiked = () => {
        if (!programProps || !programProps.likeUids) return false;

        if (likedProgramUids.find(id => id === programProps._id) || programProps.likeUids.find(id => id === user.uid)) {
            return true
        }
        return false
    }

    const likeCount = () => {
        if (programProps && programProps.likeUids) {
            if (isLiked()) {
                return programProps.likeUids.length + 1
            } else {
                return programProps.likeUids.length
            }
        }
        return 0
    }

    const onLikePress = () => !isLiked() && likeProgram(programProps._id)

    if (!programProps) return <Loading />

    return (
        <>
            <View style={{ height: '25%', width: '100%' }}>
                <ProgramHeaderImage uri={programProps.imageUri} container={{ borderRadius: 0 }} />
            </View>
            <View>
                <Pressable onPress={onDownload} style={[styles.generate, BaseColors.primaryBoxShadow]}>
                    <DownloadSvg color={BaseColors.primary} />
                </Pressable>
            </View>
            <View style={styles.container}>
                <ProgramHeader
                    name={programProps.name}
                    description={programProps.description}
                    likeCount={likeCount()}
                    isLiked={isLiked()}
                    onLikePress={onLikePress}
                />
                <ProgramWorkouts
                    workoutsObj={workoutsObj}
                    setWorkoutsObj={setWorkoutsObj}
                    navToViewWorkout={navToViewWorkout}
                    athlete
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary
    },
    container: {
        flex: 1,
        marginTop: StyleConstants.baseMargin,
        marginBottom: StyleConstants.baseMargin
    },
    generate: {
        borderRadius: 100,
        height: normalize.width(8),
        width: normalize.width(8),
        padding: 15,
        backgroundColor: BaseColors.white,
        alignSelf: 'center',
        position: 'absolute',
        bottom: -20
    }
})


const mapStateToProps = (state: ReducerProps) => ({
    programProps: state.athletes.targetProgram,
    likedProgramUids: state.athletes.likedProgramUids,
    user: state.user
})


const mapDispatchToProps = (dispatch: any) => {
    return {
        setTargetProgram: (programHeader: ProgramHeaderProps, athlete?: boolean, softlete?: boolean) => dispatch(setTargetProgram(programHeader, athlete, softlete)),
        setProgramViewWorkout: (workoutUid: string, programUid: string, athlete?: boolean) => dispatch(setProgramViewWorkout(workoutUid, programUid, athlete)),
        likeProgram: (programUid: string) => dispatch(likeProgram(programUid)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AthleteProgramTemplate);
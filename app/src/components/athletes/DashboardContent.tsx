import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { ProgramHeaderProps } from '../../services/program/types';
import { normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';
import _ from 'lodash';
import { PinExerciseProps } from '../../services/misc/types';
import { fetchPinExerciseAnalytics } from '../../services/misc/actions';
import DateTools from '../../utils/DateTools';
import { AthleteActionProps, AthletesRootProps, AthleteWorkoutsProps } from '../../services/athletes/types';
import { NetworkStackScreens } from '../../screens/network/types';
import { likeWorkout } from '../../services/athletes/actions';
import BaseColors from '../../utils/BaseColors';
import AthleteWorkoutPreviewList from './WorkoutPreviewList';
import { UserProps } from '../../services/user/types';
import { setTargetProgram } from '../../services/program/actions';


interface Props {
    workouts: AthletesRootProps['workouts'];
    navigation: any;
    likeWorkout: AthleteActionProps['likeWorkout'];
    likedWoIds: string[];
    user: UserProps;
    onFetchMonths: () => Promise<void>;
    navigateToWo: (workoutUid: string) => Promise<void>;
}

const AthleteDashboardContent = ({ workouts, navigation, likeWorkout, likedWoIds, user, onFetchMonths, navigateToWo }: Props) => {
    const [groupWos, setGroupWos] = useState<AthleteWorkoutsProps[]>([]);

    useEffect(() => {
        const groupBy =
            _(workouts)
                .map((wo) => {
                    let d = DateTools.UTCISOToLocalDate(wo.date);
                    const dStr = DateTools.dateToStr(d)
                    return {
                        ...wo,
                        dateStr: DateTools.dateToStr(d)
                    }
                })
                .groupBy('dateStr')
                .map((value, key) => ({ date: key, workouts: value }))
                .sort((a, b) => {
                    const aDate = DateTools.strToDate(a.date);
                    const bDate = DateTools.strToDate(b.date);
                    if (!aDate || !bDate) return 0
                    return aDate.getTime() - bDate.getTime()
                })
                .value();

        //sort the group

        setGroupWos(groupBy)
    }, [workouts])

    const onNavToViewWorkout = async (workoutUid: string) => {
        navigateToWo(workoutUid)
        navigation.navigate(NetworkStackScreens.AthleteWorkout)
    }

    return (
        <View style={styles.container}>
            <AthleteWorkoutPreviewList
                workouts={groupWos}
                onPress={onNavToViewWorkout}
                onLike={likeWorkout}
                onFetchMonths={onFetchMonths}
                likedWoIds={likedWoIds}
                userUid={user.uid}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        width: normalize.width(1),
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
    },
    search: {
        fontSize: StyleConstants.extraSmallFont,
        alignSelf: 'flex-start',
        marginTop: StyleConstants.smallMargin,
        backgroundColor: BaseColors.primary,
        flexDirection: 'row',
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        borderRadius: 100
    },
    searchSvg: {
        width: normalize.width(25),
        height: normalize.width(25),
    },
    searchText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.white,
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    user: state.user,
    programTemplates: state.athletes.programs,
    likedWoIds: state.athletes.likedWoIds,
    likedProgramUids: state.athletes.likedProgramUids,
})

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchPinExerciseAnalytics: (fromDate: string, toDate: string, pinExercises: PinExerciseProps[], athlete?: boolean) => dispatch(fetchPinExerciseAnalytics(fromDate, toDate, pinExercises, athlete)),
        likeWorkout: async (workoutUid: string) => dispatch(likeWorkout(workoutUid)),
        setTargetProgram: (programHeader: ProgramHeaderProps, athlete?: boolean, softlete?: boolean) => dispatch(setTargetProgram(programHeader, athlete, softlete)),
        dispatch
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AthleteDashboardContent);
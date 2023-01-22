import React, { useEffect, useState, useCallback, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import BaseColors from '../../utils/BaseColors';
import { AppDispatch } from '../../../App';
import DateTools from '../../utils/DateTools';
import { ProgramActionProps } from '../../services/program/types';
import { fetchPrograms } from '../../services/program/actions';
import DashboardContent from '../../components/athletes/DashboardContent';
import Header from '../../components/athletes/Profile';
import { AthleteProfileProps, AthleteActionProps } from '../../services/athletes/types';
import { fetchAllAthleteExercises, fetchAthleteHealthData, fetchAthleteWorkouts, getAthleteFriends, sendFriendRequest } from '../../services/athletes/actions';
import Loading from '../../components/elements/Loading';
import { SET_ATHLETE_VIEW_WORKOUT, STORE_ATHLETE_EXERCISES } from '../../services/athletes/actionTypes';
import { UserProps, FriendStatus, FriendProps } from '../../services/user/types';
import { getCurChat } from '../../services/chat/actions';
import { ChatActionProps } from '../../services/chat/types';
import MoreSvg from '../../assets/MoreSvg';
import StyleConstants from '../../components/tools/StyleConstants';
import { normalize } from '../../utils/tools';
import { NetworkStackScreens } from './types';
import AthleteDashboadLock from '../../components/athletes/DashboardLock';
import { Categories, Equipments, ExerciseProps, MeasCats, MeasSubCats, MuscleGroups } from '../../services/exercises/types';
import { HealthDataProps, WorkoutProps } from '../../services/workout/types';
import store from '../../utils/init-redux';
import { insertExercises } from '../../services/exercises/actions';
import _ from 'lodash';
import HeaderMenu from '../../components/Menu';
interface Props {
    route: any;
    navigation: any;
    fetchAthleteWorkouts: AthleteActionProps['fetchAthleteWorkouts'];
    selectedDate: string;
    dispatch: AppDispatch;
    fetchPrograms: ProgramActionProps['fetchPrograms'];
    sendFriendRequest: AthleteActionProps['sendFriendRequest'];
    fetchAllAthleteExercises: AthleteActionProps['fetchAllAthleteExercises'];
    getCurChat: ChatActionProps['getCurChat'];
    user: UserProps;
    fetchAthleteHealthData: AthleteActionProps['fetchAthleteHealthData'];
    getAthleteFriends: AthleteActionProps['getAthleteFriends']
}

const AthleteDashboard = ({ fetchAthleteHealthData, navigation, route, fetchAthleteWorkouts, fetchAllAthleteExercises, selectedDate, dispatch, fetchPrograms, sendFriendRequest, user, getCurChat, getAthleteFriends }: Props) => {
    const [loading, setLoading] = useState(false);
    const [lock, setLock] = useState(false);
    const [athlete, setAthlete] = useState<AthleteProfileProps | undefined>();
    const [exercises, setExercises] = useState<ExerciseProps[]>([]);
    const [healthData, setHealthData] = useState<HealthDataProps[]>([]);
    const [friends, setFriends] = useState<FriendProps[]>([]);
    const [workouts, setWorkouts] = useState<WorkoutProps[]>([]);
    const [monthsFetched, setMonthsFetched] = useState<{ month: number, year: number }[]>([])
    const mount = useRef(false);

    useLayoutEffect(() => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: StyleConstants.baseMargin }}>
                    <Pressable style={styles.moreContainer} onPress={() => navigation.navigate(NetworkStackScreens.AthleteModal)} hitSlop={5}>
                        <MoreSvg fillColor={BaseColors.lightBlack} />
                    </Pressable>
                    <HeaderMenu onPress={() => navigation.toggleDrawer()} />
                </View>
            ),
            headerTitle: athlete?.username ? athlete.username : ''
        })
    }, [route])


    const getFriendStatus = () => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        return user.friends.find(f => f.users.find(fUid => fUid === athlete.uid))
    }

    const isAuthorize = () => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        if (athlete.isPrivate) {
            //search if they are friends and then request
            const request = getFriendStatus()
            if (!request || request.status !== FriendStatus.accepted) {
                return false
            }
        }
        return true
    }


    const init = useCallback(async () => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        setLoading(true);

        if (!athlete || !athlete.uid) {
            navigation.goBack()
            return;
        }

        if (!isAuthorize()) {
            setLoading(false)
            return setLock(true)
        }

        //fetch all exercises
        fetchAllAthleteExercises(athlete.uid)
            .then((exs) => {
                if (exs) setExercises(exs)
            })
            .catch(err => console.log(err))
        //fetch all health data
        fetchAthleteHealthData(athlete.uid)
            .then((hlthData) => {
                if (hlthData) setHealthData(hlthData)
            })
            .catch(err => console.log(err))

        getAthleteFriends(athlete.uid)
            .then((frds) => {
                if (frds) setFriends(frds)
            })
            .catch(err => console.log(err))

        onFetchMonths()

        //fetch athlete information
        fetchPrograms(true).catch(err => console.log(err))
        setLoading(false)
    }, [route])

    useEffect(() => {
        const { athlete } = route.params;
        if (!athlete || !athlete.uid) {
            if (navigation.canGoBack()) {
                navigation.goBack()
            } else {
                navigation.navigate(NetworkStackScreens.SearchAthletes)
            }
            return;
        }
        setAthlete(athlete)
        mount.current = true;
        init()
        return () => {
            mount.current = false;
        }
    }, [route])

    const onRequestAthlete = (status: FriendStatus) => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        sendFriendRequest(athlete.uid, status).catch(err => console.log(err))
    }

    const onMessage = async () => {
        const { athlete }: { athlete: AthleteProfileProps } = route.params;
        navigation.navigate(NetworkStackScreens.Message, { athleteUid: athlete.uid })
    }

    const getFriendActionState = () => {
        const friendObj = getFriendStatus();
        if (!friendObj) return 'add'
        if (friendObj.status === FriendStatus.accepted) return 'accept'
        if (friendObj.status === FriendStatus.denied) return 'add'

        if (friendObj.status === FriendStatus.pending) {
            if (user.uid !== friendObj.lastModUid) {
                //indicates user
                return 'respond'
            } else {
                return 'pending'
            }
        }

        return 'add'
    }

    const onFetchMonths = async (add?: boolean) => {
        if (!isAuthorize()) return;
        const { athlete } = route.params;
        let dObj: { year: number, month: number } | undefined;

        if (monthsFetched.length > 0) {
            //should be asscending order
            const fetched = monthsFetched[0];
            const month = add ? fetched.month + 1 : fetched.month - 1;
            const date = new Date(fetched.year, month);

            dObj = {
                year: date.getFullYear(),
                month: date.getMonth()
            }
        } else {
            const d = new Date();
            dObj = {
                year: d.getFullYear(),
                month: d.getMonth()
            }
        }

        if (monthsFetched.find(m => _.isEqual(m, dObj))) return;

        const fromDate = new Date(dObj.year, dObj.month);
        const toDate = new Date(dObj.year, dObj.month + 1, 0);
        const fromDateStr = DateTools.dateToStr(fromDate);
        const toDateStr = DateTools.dateToStr(toDate);

        const wos = await fetchAthleteWorkouts(athlete.uid, fromDateStr, toDateStr);

        //store previous months fetched
        const month = fromDate.getMonth();
        const year = fromDate.getFullYear();
        if (mount.current) {
            setMonthsFetched(prev => [...prev, { month, year }].sort((a, b) => new Date(a.year, a.month).getTime() - new Date(b.year, b.month).getTime()));
            if (wos) setWorkouts((wo) => _.uniqBy([...wo, ...wos], '_id'))
        }
    }

    const navigateToWo = async (workoutUid: string) => {
        let workout: WorkoutProps | undefined;
        workout = workouts.find(w => w._id === workoutUid)

        if (workout && workout.exercises) {
            workout.exercises = await insertExercises(workout.exercises, true)(dispatch, store.getState as any)
            workout.exercises = workout.exercises.map(e => {
                if (!e.exercise) {
                    e.exercise = {
                        _id: Math.random().toString(),
                        description: '',
                        name: 'not found',
                        measSubCat: MeasSubCats.lb,
                        measCat: MeasCats.weight,
                        category: Categories.other,
                        muscleGroup: MuscleGroups.other,
                        equipment: Equipments.none
                    }
                }
                return {
                    ...e,
                    data: e.data.map(d => ({
                        ...d,
                        pct: d.pct ? d.pct : 100
                    }))
                }
            })

        }

        dispatch({
            type: SET_ATHLETE_VIEW_WORKOUT,
            payload: workout
        })
    }

    const navigateToFriends = () => {
        navigation.push(NetworkStackScreens.AthleteFriends, {
            friends,
            athlete
        })
    }

    const navigateToExercises = () => {
        dispatch({ type: STORE_ATHLETE_EXERCISES, payload: exercises ? exercises : [] })
        navigation.navigate(NetworkStackScreens.AthleteSearchExercises)
    }

    if (loading || !athlete) return <Loading />;

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <Header
                user={athlete}
                sendRequest={onRequestAthlete}
                onMessage={onMessage}
                friend={getFriendActionState()}
                healthData={healthData}
                workouts={workouts}
                exercises={exercises}
                friends={friends}
                navigateToFriends={navigateToFriends}
                navigateToExercises={navigateToExercises}
            />
            {
                lock ?
                    <AthleteDashboadLock />
                    :
                    <View style={styles.content}>
                        <DashboardContent
                            navigation={navigation}
                            onFetchMonths={onFetchMonths}
                            workouts={workouts}
                            navigateToWo={navigateToWo}
                        />
                    </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1
    },
    moreContainer: {
        marginRight: StyleConstants.baseMargin,
        height: normalize.width(25),
        width: normalize.width(25)
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    user: state.user,
    selectedDate: state.athletes.selectedDate,
})

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchAthleteWorkouts: (uid: string, fromDate: string, toDate: string) => dispatch(fetchAthleteWorkouts(uid, fromDate, toDate)),
        fetchPrograms: (athlete?: boolean) => dispatch(fetchPrograms(athlete)),
        sendFriendRequest: (userUid: string, status: FriendStatus) => dispatch(sendFriendRequest(userUid, status)),
        getCurChat: (userUid: string, chatId: string) => dispatch(getCurChat(userUid, chatId)),
        fetchAllAthleteExercises: (uid: string) => dispatch(fetchAllAthleteExercises(uid)),
        fetchAthleteHealthData: (uid: string) => dispatch(fetchAthleteHealthData(uid)),
        getAthleteFriends: (uid: string) => dispatch(getAthleteFriends(uid)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AthleteDashboard);
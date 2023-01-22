import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { connect, useSelector } from 'react-redux';
import { AppDispatch } from '../../../App';
import DashboardDemo from '../../components/demo/Demo';
import HomeExercises from '../../components/home/Exercises';
import { HomeHeader, HomeNavBar } from '../../components/home/Header';
import HomeWorkouts from '../../components/home/Workouts';
import { ReducerProps } from '../../services';
import { getChats } from '../../services/chat/actions';
import { ChatActionProps } from '../../services/chat/types';
import {
  fetchLocalStoreExercisesToState,
  fetchAllUserExercises,
} from '../../services/exercises/actions';
import {
  ExerciseActionProps,
  ExerciseProps,
} from '../../services/exercises/types';
import {
  getGlobalVars,
  goOffline,
  processBatches,
} from '../../services/global/actions';
import { fetchPinExerciseAnalytics } from '../../services/misc/actions';
import { MiscActionProps, PinExerciseProps } from '../../services/misc/types';
import {
  fetchNotifications,
  processNotification,
} from '../../services/notifications/actions';
import { NotificationActionProps } from '../../services/notifications/types';
import { fetchGeneratedPrograms } from '../../services/program/actions';
import { ProgramActionProps } from '../../services/program/types';
import { initSockets } from '../../services/sockets/actions';
import { getFriends } from '../../services/user/actions';
import { UserActionProps } from '../../services/user/types';
import {
  fetchWorkouts,
  getAllHealthData,
} from '../../services/workout/actions';
import { WorkoutActionProps } from '../../services/workout/types';
import { normalize } from '../../utils/tools';
import { HomeStackScreens } from './types';
import { Picker } from '@react-native-picker/picker';
import _ from 'lodash';
import HomeHealth from '../../components/home/Health';
import StyleConstants from '../../components/tools/StyleConstants';
import { useNotifeeListener } from '../../hooks/home/notifee.hooks';
import { useActiveWos } from '../../hooks/home/workout.hooks';
import { useApiHooks } from '../../hooks/home/api.hooks';
import HomeBackground from '../../components/home/Background';
import { ScreenTemplate, Picker as CustomPicker } from '@app/elements';
import { useMemo } from 'react';

interface Props {
  route: any;
  navigation: any;
  fetchWorkouts: WorkoutActionProps['fetchWorkouts'];
  dispatch: AppDispatch;
  fetchGeneratedPrograms: ProgramActionProps['fetchGeneratedPrograms'];
  removeGeneratedProgram: ProgramActionProps['removeGeneratedProgram'];
  getFriends: UserActionProps['getFriends'];
  getChats: ChatActionProps['getChats'];
  initSockets: () => void;
  goOffline: () => Promise<void>;
  fetchLocalStoreExercisesToState: ExerciseActionProps['fetchLocalStoreExercisesToState'];
  fetchNotifications: NotificationActionProps['fetchNotifications'];
  processBatches: () => Promise<void>;
  fetchAllUserExercises: ExerciseActionProps['fetchAllUserExercises'];
  getAllHealthData: () => Promise<void>;
  fetchPinExerciseAnalytics: MiscActionProps['fetchPinExerciseAnalytics'];
  getGlobalVars: () => Promise<void>;
  processNotification: NotificationActionProps['processNotification'];
}

const Home = ({
  navigation,
  getGlobalVars,
  fetchPinExerciseAnalytics,
  getAllHealthData,
  fetchWorkouts,
  dispatch,
  fetchGeneratedPrograms,
  getFriends,
  initSockets,
  getChats,
  fetchLocalStoreExercisesToState,
  fetchNotifications,
  processBatches,
  fetchAllUserExercises,
  route,
  processNotification,
}: Props) => {
  const { user, workouts, offline, healthData, analytics, exercises } =
    useSelector((state: ReducerProps) => ({
      user: state.user,
      workouts: state.workout.workouts,
      offline: state.global.offline,
      healthData: state.workout.healthData,
      exercises: state.exercises.data,
      analytics: state.misc.pinExercisesAnalytics,
    }));
  const [picker, setPicker] = useState<string | undefined>();
  const [chartFilter, setChartFilter] = useState('avg');
  const [selectedEx, setSelectedEx] = useState<ExerciseProps>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<any>();

  const { wos, deviceWos } = useActiveWos(workouts);

  useNotifeeListener(navigation, processNotification, dispatch);

  useApiHooks(
    offline,
    user,
    {
      fetchWorkouts,
      fetchGeneratedPrograms,
      getFriends,
      getChats,
      initSockets,
      fetchLocalStoreExercisesToState,
      fetchNotifications,
      processBatches,
      fetchAllUserExercises,
      getAllHealthData,
      getGlobalVars,
      fetchPinExerciseAnalytics,
    },
    dispatch,
  );

  useEffect(() => {
    if (route.params && route.params.directToDash) {
      navigation.navigate(HomeStackScreens.Calendar);
    }
  }, [route]);

  const getFilteredAnalExs = () => {
    const exStore: ExerciseProps[] = [];

    analytics.forEach(p => {
      const e = exercises.find(e => e._id === p.exerciseUid);
      //only add exercise if analytics items is more than 3
      if (e && p.data.length > 3) {
        exStore.push(e);
      }
    });

    return exStore;
  };

  const renderPickerItems = () => {
    if (picker && picker === 'chartFilter') {
      const items = ['avg', 'min', 'max'].map(s => (
        <Picker.Item value={s} label={_.capitalize(s)} key={s} />
      ));
      return items;
    }

    const exStore: ExerciseProps[] = getFilteredAnalExs();

    const items = exStore
      .filter(d => d.name && d._id)
      .map(d => (
        <Picker.Item value={d._id} label={_.capitalize(d.name)} key={d._id} />
      ));

    items.unshift(<Picker.Item value={undefined} label={''} key={'nothing'} />);
    return items;
  };

  const onPickerChange = (id: string) => {
    if (picker && picker === 'chartFilter') {
      setChartFilter(id);
    } else {
      const exStore: ExerciseProps[] = getFilteredAnalExs();
      const picked = exStore.find(d => d._id === id);
      setSelectedEx(picked);
    }
  };

  const onMomentumScrollEnd = (e: any) => {
    const { nativeEvent } = e;
    const index = Math.round(nativeEvent.contentOffset.x / normalize.width(1));
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const bannerTxt = useMemo(() => {
    let txt = '';
    if (wos.length > 0) {
      txt = `You have ${wos.length} workout${
        wos.length > 1 ? 's' : ''
      } planned for today.`;
      if (deviceWos.length > 0) {
        txt += ` You also have pending device activities to import.`;
      }
    } else if (deviceWos.length > 0) {
      txt = `You have pending device activities.`;
    } else {
      txt = `Looks like you don't have any workouts planned. Recovery is just as important as training. Enjoy your rest day.`;
    }
    return txt;
  }, [wos, deviceWos]);

  return (
    <ScreenTemplate>
      <HomeBackground />
      <DashboardDemo screen={HomeStackScreens.Home} />
      <HomeHeader />
      <HomeNavBar currentIndex={currentIndex} scrollRef={scrollRef} />
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        contentContainerStyle={{ paddingTop: StyleConstants.baseMargin }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <HomeHealth healthData={healthData} navigation={navigation} />
        <HomeWorkouts wos={wos} deviceWos={deviceWos} desc={bannerTxt} />
        <HomeExercises
          pinAnalytics={analytics}
          setPicker={setPicker}
          chartFilter={chartFilter}
          selectedEx={selectedEx}
        />
      </ScrollView>
      <CustomPicker
        pickerItems={renderPickerItems()}
        setOpen={o => setPicker(undefined)}
        open={picker ? true : false}
        value={''}
        setValue={onPickerChange}
        hidebgColor
      />
    </ScreenTemplate>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchWorkouts: (fromDate: string, toDate: string) =>
      dispatch(fetchWorkouts(fromDate, toDate)),
    fetchGeneratedPrograms: () => dispatch(fetchGeneratedPrograms()),
    getFriends: () => dispatch(getFriends()),
    initSockets: () => dispatch(initSockets()),
    getChats: () => dispatch(getChats()),
    goOffline: () => dispatch(goOffline()),
    fetchLocalStoreExercisesToState: async () =>
      dispatch(fetchLocalStoreExercisesToState()),
    fetchNotifications: () => dispatch(fetchNotifications()),
    processBatches: () => dispatch(processBatches()),
    fetchAllUserExercises: () => dispatch(fetchAllUserExercises()),
    getAllHealthData: () => dispatch(getAllHealthData()),
    fetchPinExerciseAnalytics: (
      fromD: string,
      toD: string,
      pinExs: PinExerciseProps[],
    ) => dispatch(fetchPinExerciseAnalytics(fromD, toD, pinExs)),
    getGlobalVars: async () => dispatch(getGlobalVars()),
    processNotification: (
      screen: string,
      title?: string,
      body?: string,
      data?: {
        [key: string]: string;
      },
    ) => dispatch(processNotification(screen, title, body, data)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(Home);

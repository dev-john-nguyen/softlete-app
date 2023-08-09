import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { connect, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../App';
import DashboardDemo from '../../../../components/demo/Demo';
import HomeExercises from './Exercises';
import HomeWorkouts from './Workouts';
import { ReducerProps } from '../../../../services';
import { getChats } from '../../../../services/chat/actions';
import { ChatActionProps } from '../../../../services/chat/types';
import {
  fetchLocalStoreExercisesToState,
  fetchAllUserExercises,
} from '../../../../services/exercises/actions';
import {
  ExerciseActionProps,
  ExerciseProps,
} from '../../../../services/exercises/types';
import {
  getGlobalVars,
  goOffline,
  processBatches,
} from '../../../../services/global/actions';
import { fetchPinExerciseAnalytics } from '../../../../services/misc/actions';
import {
  MiscActionProps,
  PinExerciseProps,
} from '../../../../services/misc/types';
import {
  fetchNotifications,
  processNotification,
} from '../../../../services/notifications/actions';
import { NotificationActionProps } from '../../../../services/notifications/types';
import { fetchGeneratedPrograms } from '../../../../services/program/actions';
import { ProgramActionProps } from '../../../../services/program/types';
import { initSockets } from '../../../../services/sockets/actions';
import { getFriends } from '../../../../services/user/actions';
import { UserActionProps } from '../../../../services/user/types';
import {
  fetchWorkouts,
  getAllHealthData,
} from '../../../../services/workout/actions';
import { WorkoutActionProps } from '../../../../services/workout/types';
import { normalize } from '../../../../utils/tools';
import { HomeStackScreens } from '../../types';
import HomeHealth from './Health';
import StyleConstants from '../../../../components/tools/StyleConstants';
import { useNotifeeListener } from '../../../../hooks/home/notifee.hooks';
import { useActiveWos } from '../../../../hooks/home/workout.hooks';
import { useApiHooks } from '../../../../hooks/home/api.hooks';
import HomeBackground from './Background';
import { ScreenTemplate } from '@app/elements';
import { useMemo } from 'react';
import { Colors } from '@app/utils';
import { HomeHeader, HomeNavBar } from './Header';

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
  const {
    user,
    workouts,
    offline,
    healthData,
    pinExercisesAnalytics,
    exercises,
  } = useSelector((state: ReducerProps) => ({
    user: state.user,
    workouts: state.workout.workouts,
    offline: state.global.offline,
    healthData: state.workout.healthData,
    exercises: state.exercises.data,
    pinExercisesAnalytics: state.misc.pinExercisesAnalytics,
  }));
  const [picker, setPicker] = useState<string | undefined>();
  const [chartFilter, setChartFilter] = useState('avg');
  const [selectedEx, setSelectedEx] = useState<ExerciseProps>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<any>();

  const { wos, deviceWos } = useActiveWos(workouts);

  useNotifeeListener(navigation, processNotification, dispatch);

  useApiHooks(offline, user, {
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
  });

  useEffect(() => {
    if (route.params && route.params.directToDash) {
      navigation.navigate(HomeStackScreens.Calendar);
    }
  }, [navigation, route]);

  const pinnedExerciseProps = useMemo(() => {
    const pinnedExerciseProps = user.pinExercises
      .map(p => {
        return exercises.find(e => e._id === p.exerciseUid);
      })
      .filter(e => !!e);
    return pinnedExerciseProps as ExerciseProps[];
  }, [exercises, user.pinExercises]);

  const pickerOptions = useMemo(() => {
    if (picker && picker === 'chartFilter') {
      const items = ['avg', 'min', 'max'].map(s => ({
        value: s,
        label: s,
      }));
      return items;
    }

    const items = pinnedExerciseProps
      .filter(d => d.name && d._id)
      .map(d => ({
        value: d._id as string,
        label: d.name as string,
        color: '',
      }));

    items.unshift({
      value: '',
      label: 'Choose an exericse',
      color: Colors.secondary,
    });
    return items;
  }, [picker, pinnedExerciseProps]);

  const onPickerChange = (id: string) => {
    if (picker && picker === 'chartFilter') {
      setChartFilter(id);
    } else {
      const picked = pinnedExerciseProps.find(d => d._id === id);
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
      txt = `You have pending device activities to import.`;
    } else {
      txt = `Looks like you don't have any workouts planned for today.`;
    }
    return txt;
  }, [wos, deviceWos]);

  return (
    <ScreenTemplate
      pickerOptions={pickerOptions}
      isPickerOpen={picker ? true : false}
      onPickerClose={() => setPicker(undefined)}
      pickerValue={picker === 'chartFilter' ? chartFilter : selectedEx?._id}
      onPickerChangeValue={onPickerChange}>
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
        <HomeHealth healthData={healthData} />
        <HomeWorkouts wos={wos} deviceWos={deviceWos} desc={bannerTxt} />
        <HomeExercises
          pinAnalytics={pinExercisesAnalytics}
          setPicker={setPicker}
          chartFilter={chartFilter}
          selectedEx={selectedEx}
        />
      </ScrollView>
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

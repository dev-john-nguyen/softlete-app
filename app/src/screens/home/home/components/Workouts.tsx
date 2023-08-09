import React, { useState } from 'react';
import { Colors } from '@app/utils';
import { CircleAdd } from '@app/elements';
import { FlexBox } from '@app/ui';
import { AppDispatch } from '../../../../../App';
import { HomeStackScreens } from '../../types';
import { INITIATE_WORKOUT_HEADER } from '../../../../services/workout/actionTypes';
import {
  HealthDataProps,
  WorkoutActionProps,
  WorkoutHeaderProps,
  WorkoutProps,
} from '../../../../services/workout/types';
import DateTools from '../../../../utils/DateTools';
import SectionHeader from '../../../../components/home/components/SectionHeader';
import { handleDeviceActivityImport } from '../../../../helpers/route.helpers';
import { connect } from 'react-redux';
import {
  setViewWorkout,
  updateWoHealthData,
  updateWorkoutHeader,
  updateWoWorkoutRoute,
} from '../../../../services/workout/actions';
import { setBanner } from '../../../../services/banner/actions';
import {
  BannerActionsProps,
  BannerTypes,
} from '../../../../services/banner/types';
import { LocationValue } from 'react-native-health';
import { useNavigation } from '@react-navigation/native';
import Icon from '@app/icons';
import WorkoutPreviewList from 'src/components/workout/preview/PreviewList';

interface Props {
  wos: WorkoutProps[];
  dispatch: AppDispatch;
  setViewWorkout: WorkoutActionProps['setViewWorkout'];
  deviceWos: HealthDataProps[];
  updateWorkoutHeader: WorkoutActionProps['updateWorkoutHeader'];
  updateWoWorkoutRoute: WorkoutActionProps['updateWoWorkoutRoute'];
  updateWoHealthData: WorkoutActionProps['updateWoHealthData'];
  setBanner: BannerActionsProps['setBanner'];
  desc: string;
}

const HomeWorkouts = ({
  wos,
  dispatch,
  setViewWorkout,
  deviceWos,
  updateWorkoutHeader,
  updateWoWorkoutRoute,
  updateWoHealthData,
  desc,
  setBanner,
}: Props) => {
  const navigation = useNavigation<any>();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const d = new Date();
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const onAddWoPress = () => {
    dispatch({
      type: INITIATE_WORKOUT_HEADER,
      payload: {
        date: DateTools.dateToStr(today),
      },
    });
    navigation.navigate(HomeStackScreens.WorkoutHeader);
  };

  const onNavToCalendar = () => navigation.navigate(HomeStackScreens.Calendar);

  const onNavToDeviceActivities = () =>
    navigation.navigate(HomeStackScreens.DeviceActivities);

  const onNavToWorkout = (workoutUid: string) => () => {
    setViewWorkout(workoutUid);
    navigation.navigate(HomeStackScreens.Workout);
  };

  const onImportDeviceWo = (activity: HealthDataProps) => async () => {
    setLoadingIds(ids => [...ids, activity.activityId]);
    try {
      await handleDeviceActivityImport(activity, {
        updateWoHealthData,
        updateWoWorkoutRoute,
        updateWorkoutHeader,
      });
    } catch (err) {
      setBanner(BannerTypes.error, err as string);
    }
    setLoadingIds(ids => ids.filter(id => id !== activity.activityId));
  };

  return (
    <FlexBox
      flexDirection="column"
      screenWidth
      paddingLeft={20}
      paddingRight={20}>
      <SectionHeader
        title="Workouts"
        desc={desc}
        RightElement={
          <FlexBox>
            <Icon
              icon="upload"
              onPress={onNavToDeviceActivities}
              size={20}
              hitSlop={5}
              color={Colors.white}
              containerStyles={{ marginRight: 15 }}
            />
            <Icon
              icon="calendar"
              onPress={onNavToCalendar}
              size={20}
              hitSlop={5}
              color={Colors.white}
            />
          </FlexBox>
        }
      />
      <FlexBox marginTop={20}>
        {wos.length > 0 && (
          <WorkoutPreviewList workouts={wos} onPress={onNavToWorkout} />
        )}
      </FlexBox>
      <CircleAdd onPress={onAddWoPress} />
    </FlexBox>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  updateWoHealthData: (workoutUid: string, healthData: HealthDataProps) =>
    dispatch(updateWoHealthData(workoutUid, healthData)),
  updateWorkoutHeader: (workoutHeader: WorkoutHeaderProps) =>
    dispatch(updateWorkoutHeader(workoutHeader)),
  updateWoWorkoutRoute: (
    workoutUid: string,
    locations: LocationValue[],
    activityId?: string,
  ) => dispatch(updateWoWorkoutRoute(workoutUid, locations, activityId)),
  setBanner: (type: BannerTypes, msg: string) => dispatch(setBanner(type, msg)),
  setViewWorkout: (workoutUid: string) => dispatch(setViewWorkout(workoutUid)),
  dispatch,
});

export default connect(null, mapDispatchToProps)(HomeWorkouts);

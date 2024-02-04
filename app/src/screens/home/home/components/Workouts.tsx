import React from 'react';
import { Colors } from '@app/utils';
import { CircleAdd, DemoArrow } from '@app/elements';
import { FlexBox } from '@app/ui';
import { HomeStackScreens } from '../../types';
import { INITIATE_WORKOUT_HEADER } from '../../../../services/workout/actionTypes';
import { WorkoutProps } from '../../../../services/workout/types';
import DateTools from '../../../../utils/DateTools';
import SectionHeader from '../../../../components/home/components/SectionHeader';
import { useDispatch } from 'react-redux';
import { setViewWorkout } from '../../../../services/workout/actions';
import { useNavigation } from '@react-navigation/native';
import Icon from '@app/icons';
import WorkoutPreviewList from 'src/components/workout/preview/PreviewList';
import { DemoStates } from '@app/services';

interface Props {
  wos: WorkoutProps[];
  desc: string;
}

const HomeWorkouts = ({ wos, desc }: Props) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

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

  const onNavToWorkout = (workoutUid: string) => {
    dispatch(setViewWorkout(workoutUid));
    navigation.navigate(HomeStackScreens.Workout);
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
            <DemoArrow
              state={[
                DemoStates.HOME_WORKOUTS_CALENDAR,
                DemoStates.HOME_WORKOUTS_DEVICE_ACTIVITES,
              ]}
            />
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

export default HomeWorkouts;

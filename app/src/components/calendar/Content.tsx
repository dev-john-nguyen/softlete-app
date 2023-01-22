import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import { Colors, Constants, DateTools } from '@app/utils';
import { WorkoutActionProps } from '../../services/workout/types';
import WorkoutPreviewList from '../workout/preview/PreviewList';
import { AppDispatch } from '../../../App';
import {
  INITIATE_WORKOUT_HEADER,
  SET_COPY_WORKOUT,
} from '../../services/workout/actionTypes';
import { ReducerProps } from '../../services';
import { setViewWorkout } from '../../services/workout/actions';
import { connect, useSelector } from 'react-redux';
import { ProgramHeaderProps } from '../../services/program/types';
import { PinExerciseProps } from '../../services/misc/types';
import { HomeStackScreens } from '../../screens/home/types';
import { setTargetProgram } from '../../services/program/actions';
import { updatePinExercises } from '../../services/user/actions';

interface Props {
  dispatch: AppDispatch;
  navigation: any;
  setViewWorkout: WorkoutActionProps['setViewWorkout'];
  loading: boolean;
}

const DashboardContent = ({
  dispatch,
  navigation,
  setViewWorkout,
  loading,
}: Props) => {
  const { selectedDate, workouts } = useSelector((state: ReducerProps) => ({
    selectedDate: state.workout.selectedDate,
    workouts: state.workout.selectedDateWorkouts,
  }));
  const onNavToAddWorkout = () => {
    dispatch({
      type: INITIATE_WORKOUT_HEADER,
      payload: {
        date: selectedDate,
      },
    });
    navigation.navigate(HomeStackScreens.WorkoutHeader, { directToDash: true });
  };

  const onNavToViewWorkout = async (workoutUid: string) => {
    setViewWorkout(workoutUid);
    navigation.navigate(HomeStackScreens.Workout, { directToDash: true });
  };

  const onCopyWorkout = (workoutUid: string) => {
    dispatch({ type: SET_COPY_WORKOUT, payload: workoutUid });
  };

  return (
    <FlexBox flex={1}>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <FlexBox flex={1} column>
          {(() => {
            const d = DateTools.strToDate(selectedDate);
            if (!d) return;
            return (
              <FlexBox justifyContent="space-between" marginBottom={10}>
                <PrimaryText size="small">
                  {Constants.months[d.getMonth()] +
                    ' ' +
                    d.getDate() +
                    ', ' +
                    d.getFullYear()}
                </PrimaryText>
                <PrimaryText size="small" textTransform="capitalize">
                  {Constants.daysOfWeek[d.getDay()]}
                </PrimaryText>
              </FlexBox>
            );
          })()}
          <WorkoutPreviewList
            workouts={workouts}
            onPress={onNavToViewWorkout}
            onLongPress={onCopyWorkout}
            onAddWorkout={onNavToAddWorkout}
          />
        </FlexBox>
      )}
    </FlexBox>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setViewWorkout: async (workoutUid: string) =>
      dispatch(setViewWorkout(workoutUid)),
    setTargetProgram: (programProps: ProgramHeaderProps) =>
      dispatch(setTargetProgram(programProps)),
    updatePinExercises: (pinProps: PinExerciseProps, pin: boolean) =>
      dispatch(updatePinExercises(pinProps, pin)),
    dispatch,
  };
};
export default connect(null, mapDispatchToProps)(DashboardContent);

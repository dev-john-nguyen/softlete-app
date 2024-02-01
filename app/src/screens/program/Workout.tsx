import React, { Dispatch } from 'react';
import { ReducerProps } from '../../services';
import { connect, useSelector } from 'react-redux';
import {
  WorkoutStatus,
  WorkoutTypes,
  HealthDataProps,
  DataArrProps,
} from '../../services/workout/types';
import { ExerciseProps } from '../../services/exercises/types';
import WorkoutContainer from '../../components/workout/Container';
import { ProgramActionProps } from '../../services/program/types';
import Loading from '../../components/elements/Loading';
import { BannerTypes } from '../../services/banner/types';
import {
  updateProgramExerciseData,
  updateProgramWoHealthData,
} from '../../services/program/actions';
import { ProgramStackScreens } from './types';
import { WorkoutProvider } from '@app/contexts';
import { ScreenTemplate } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigationState } from '@react-navigation/native';
import StagingActions from 'src/components/workout/StagingActions';
import EnduranceWrapper from 'src/components/workout/endurance';

interface Props {
  route: any;
  navigation: any;
  dispatch: React.Dispatch<any>;
  updateProgramWoHealthData: ProgramActionProps['updateProgramWoHealthData'];
  updateProgramExerciseData: ProgramActionProps['updateProgramExerciseData'];
}

const Workout = ({ route, navigation, updateProgramWoHealthData }: Props) => {
  const { workout, targetProgram } = useSelector((state: ReducerProps) => ({
    workout: state.program.viewWorkout,
    targetProgram: state.program.targetProgram,
  }));
  const navigationState = useNavigationState(state => state);

  const onBackButtonPress = () => {
    const routes = navigationState.routes;
    // Don't allow go back to workout header
    if (
      routes[routes.length - 2]?.name ===
      ProgramStackScreens.ProgramWorkoutHeader
    ) {
      return navigation.navigate(ProgramStackScreens.Program);
    }

    if (route.params?.goBackScreen) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { workouts, ...rest } = targetProgram;
      navigation.navigate(route.params.goBackScreen, {
        program: rest,
      });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ProgramStackScreens.TemplateList);
    }
  };

  const onNavigateToAddExercise = (group: number, order: number) => {
    if (!workout) return;
    navigation.navigate(ProgramStackScreens.ProgramSearchExercises, {
      group,
      order,
      workoutUid: workout._id,
      programTemplateUid: workout.programTemplateUid,
      goBackScreen: route.params?.goBackScreen,
    });
  };

  const onUpdateWoHealthData = async (
    workoutUid: string,
    data: HealthDataProps,
  ) => {
    await updateProgramWoHealthData(
      workout.programTemplateUid,
      workoutUid,
      data,
    ).catch(err => console.error(err));
  };

  const onNavigateToExercise = (exercise: ExerciseProps) => {
    navigation.navigate(ProgramStackScreens.ProgramExercise, { exercise });
  };

  if (!workout) return <Loading />;

  const disableEdit = route.params && route.params.softlete ? true : false;

  return (
    <WorkoutProvider
      onNavigateToExercise={onNavigateToExercise}
      onNavigateToAddExercise={onNavigateToAddExercise}
      updateWoHealthData={onUpdateWoHealthData}
      isProgram>
      <ScreenTemplate
        headerTitleFormatted={workout.name}
        isBackVisible
        onGoBack={onBackButtonPress}
        rightContent={
          <FlexBox flex={1} alignItems="flex-end" justifyContent="flex-end">
            {workout?.status !== WorkoutStatus.inProgress && !disableEdit && (
              <Icon
                icon="ellipsis"
                size={20}
                color={Colors.white}
                onPress={() =>
                  navigation.navigate(ProgramStackScreens.ProgramWorkoutModal)
                }
              />
            )}
          </FlexBox>
        }>
        {workout.type === WorkoutTypes.TraditionalStrengthTraining ? (
          <WorkoutContainer />
        ) : (
          <EnduranceWrapper />
        )}
        <StagingActions />
      </ScreenTemplate>
    </WorkoutProvider>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateProgramExerciseData: async (dataArr: DataArrProps[]) =>
      dispatch(updateProgramExerciseData(dataArr)),
    updateProgramWoHealthData: async (
      programTemplateUid: string,
      workoutUid: string,
      data: HealthDataProps,
    ) =>
      dispatch(updateProgramWoHealthData(programTemplateUid, workoutUid, data)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(Workout);

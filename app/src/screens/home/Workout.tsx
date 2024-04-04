import React, { useEffect, useState, Dispatch, useCallback } from 'react';
import { ReducerProps } from '../../services';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { connect, useSelector } from 'react-redux';
import {
  WorkoutActionProps,
  WorkoutStatus,
  WorkoutTypes,
  HealthDataProps,
} from '../../types/workouts.types';
import { ExerciseProps } from '../../types/exercises.types';
import WorkoutContainer from '../../components/workout/Container';
import {
  GeneratedProgramProps,
  ProgramActionProps,
} from '../../services/program/types';
import {
  updateWorkoutStatus,
  updateWoHealthData,
  updateWoWorkoutRoute,
} from '../../services/workout/actions';
import { HomeStackScreens } from './types';
import Loading from '../../components/elements/Loading';
import { BannerTypes } from '../../services/banner/types';
import { updateProgramWoHealthData } from '../../services/program/actions';
import ScreenTemplate from '../../components/elements/screen-template';
import { LocationValue } from 'react-native-health';
import { handleDeviceActivityImport } from '../../helpers/route.helpers';
import { WorkoutProvider } from '@app/contexts';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import useBanner from 'src/hooks/utils/useBanner';
import { FlexBox } from '@app/ui';
import { DemoArrow } from '@app/elements';
import { DemoStates } from '@app/services';
import StagingActions from 'src/components/workout/StagingActions';
import EnduranceWrapper from 'src/components/workout/endurance';

interface Props {
  updateWorkoutStatus: WorkoutActionProps['updateWorkoutStatus'];
  updateWoHealthData: WorkoutActionProps['updateWoHealthData'];
  updateProgramWoHealthData: ProgramActionProps['updateProgramWoHealthData'];
  updateWoWorkoutRoute: WorkoutActionProps['updateWoWorkoutRoute'];
}

const Workout = ({
  updateWorkoutStatus,
  updateWoHealthData,
  updateWoWorkoutRoute,
}: Props) => {
  const [program, setProgram] = useState<GeneratedProgramProps>();
  const [reflection, setReflection] = useState('');
  const { workout, genPrograms, targetProgram } = useSelector(
    (state: ReducerProps) => ({
      workout: state.workout.viewWorkout,
      genPrograms: state.program.generatedPrograms,
      targetProgram: state.program.targetProgram,
    }),
  );
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const setBanner = useBanner();
  const navigationState = useNavigationState(state => state);

  const handleInitiateWorkout = useCallback(async () => {
    if (workout) {
      //find generated program
      const foundProgram = genPrograms.find(p => p._id === workout.programUid);

      if (foundProgram) {
        setProgram(foundProgram);
      } else {
        setProgram(undefined);
      }
    }
  }, [workout, genPrograms]);

  const onBackButtonPress = () => {
    const routes = navigationState.routes;
    // Don't allow go back to workout header
    if (routes[routes.length - 2]?.name === HomeStackScreens.WorkoutHeader) {
      return navigation.navigate(HomeStackScreens.Home);
    }

    if (route.params?.goBackScreen) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { workouts, ...rest } = targetProgram;
      navigation.navigate(route.params.goBackScreen, {
        program: rest,
      });
      return;
    }

    if (route.params?.directToDash) {
      navigation.navigate(HomeStackScreens.Home, {
        directToDash: true,
      });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(HomeStackScreens.Home);
    }
  };

  useEffect(() => {
    handleInitiateWorkout();
  }, [workout]);

  const onUpdateStatus = async (status: WorkoutStatus) => {
    if (!workout || workout.programTemplateUid) {
      return;
    }
    if (status === workout.status) {
      return;
    }

    // check if there are any exercises
    if (
      (status === WorkoutStatus.completed ||
        status === WorkoutStatus.inProgress) &&
      workout.type === WorkoutTypes.TraditionalStrengthTraining &&
      (!workout.exercises || workout.exercises.length < 1)
    ) {
      setBanner('Please add an exercise.', BannerTypes.warning);
      return;
    }

    if (
      status === WorkoutStatus.completed &&
      workout.type === WorkoutTypes.TraditionalStrengthTraining &&
      (!workout.exercises || workout.exercises.length < 1)
    ) {
      setBanner(
        'There are no exercises in this workout. Cannot complete',
        BannerTypes.warning,
      );
      return;
    }

    await updateWorkoutStatus(workout._id, status).catch(err => {
      console.log(err);
    });
  };

  const onNavigateToAddExercise = (group: number, order: number) => {
    if (!workout) {
      return;
    }
    navigation.navigate(HomeStackScreens.SearchExercises, {
      group,
      order,
      workoutUid: workout._id,
      programTemplateUid: workout.programTemplateUid,
      goBackScreen: route.params?.goBackScreen,
    });
  };

  const onUpdateWoHealthData = async (
    workoutUid: string,
    activity: HealthDataProps,
  ) =>
    handleDeviceActivityImport(
      activity,
      { updateWoWorkoutRoute, updateWoHealthData },
      workoutUid,
    );

  const onNavigateToExercise = (exercise: ExerciseProps) => {
    navigation.navigate(HomeStackScreens.Exercise, { exercise });
  };

  if (!workout) {
    return <Loading />;
  }

  return (
    <WorkoutProvider
      onNavigateToExercise={onNavigateToExercise}
      onNavigateToAddExercise={onNavigateToAddExercise}
      onUpdateStatus={onUpdateStatus}
      setReflection={setReflection}
      updateWoHealthData={onUpdateWoHealthData}>
      <ScreenTemplate
        isBackVisible
        headerTitleFormatted={workout.name}
        onGoBack={onBackButtonPress}
        rightContentFlex={0.4}
        rightContent={
          <FlexBox
            flex={1}
            width="auto"
            alignItems="center"
            justifyContent="flex-end">
            <DemoArrow state={[DemoStates.WORKOUT_VIEW_MENU]} />
            <Icon
              icon="notebook"
              size={25}
              color={Colors.white}
              onPress={() =>
                navigation.navigate(HomeStackScreens.WorkoutReflectionModal)
              }
            />
            <Icon
              icon="timer"
              size={25}
              color={Colors.white}
              onPress={() => navigation.navigate(HomeStackScreens.Timer)}
              containerStyles={{ marginLeft: 10 }}
            />
            <Icon
              icon="ellipsis"
              size={20}
              color={Colors.white}
              onPress={() => navigation.navigate(HomeStackScreens.WorkoutModal)}
              containerStyles={{ marginLeft: 10 }}
            />
          </FlexBox>
        }>
        <DemoArrow
          state={[
            DemoStates.WORKOUT_VIEW,
            DemoStates.WORKOUT_VIEW_STATUS,
            DemoStates.WORKOUT_VIEW_CHANGE_WARM_UP,
            DemoStates.WORKOUT_VIEW_CHANGE_WARM_UP,
            DemoStates.WORKOUT_VIEW_ADD_EXERCISE,
            DemoStates.WORKOUT_VIEW_ADD_EXERCISE_BOTTOM,
          ]}
        />
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
    updateWorkoutStatus: async (workoutUid: string, status: WorkoutStatus) =>
      dispatch(updateWorkoutStatus(workoutUid, status)),
    updateWoHealthData: async (workoutUid: string, data: HealthDataProps) =>
      dispatch(updateWoHealthData(workoutUid, data)),
    updateProgramWoHealthData: async (
      programTemplateUid: string,
      workoutUid: string,
      data: HealthDataProps,
    ) =>
      dispatch(updateProgramWoHealthData(programTemplateUid, workoutUid, data)),
    updateWoWorkoutRoute: async (
      workoutUid: string,
      locations: LocationValue[],
      activityId?: string,
    ) => dispatch(updateWoWorkoutRoute(workoutUid, locations, activityId)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(Workout);

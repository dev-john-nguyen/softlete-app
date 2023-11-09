import React, { useEffect, useState, Dispatch, useCallback } from 'react';
import { ReducerProps } from '../../services';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { connect, useSelector } from 'react-redux';
import {
  WorkoutActionProps,
  WorkoutStatus,
  WorkoutExerciseProps,
  WorkoutProps,
  WorkoutTypes,
  HealthDataProps,
} from '../../services/workout/types';
import { ExerciseProps } from '../../services/exercises/types';
import WorkoutContainer from '../../components/workout/Container';
import {
  GeneratedProgramProps,
  ProgramActionProps,
} from '../../services/program/types';
import {
  updateWorkoutStatus,
  completeWorkout,
  updateWoHealthData,
  updateWoWorkoutRoute,
} from '../../services/workout/actions';
import WorkoutHeader from '../../components/workout/Header';
import { HomeStackScreens } from './types';
import Loading from '../../components/elements/Loading';
import { BannerTypes } from '../../services/banner/types';
import { ImageProps } from '../../services/user/types';
import OverviewContainer from '../../components/workout/overview/Container';
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

interface Props {
  updateWorkoutStatus: WorkoutActionProps['updateWorkoutStatus'];
  completeWorkout: WorkoutActionProps['completeWorkout'];
  updateWoHealthData: WorkoutActionProps['updateWoHealthData'];
  updateProgramWoHealthData: ProgramActionProps['updateProgramWoHealthData'];
  updateWoWorkoutRoute: WorkoutActionProps['updateWoWorkoutRoute'];
}

const Workout = ({
  updateWorkoutStatus,
  completeWorkout,
  updateWoHealthData,
  updateWoWorkoutRoute,
}: Props) => {
  const [program, setProgram] = useState<GeneratedProgramProps>();
  const [reflection, setReflection] = useState('');
  const [image, setImage] = useState<ImageProps>();
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
    if (!workout || workout.programTemplateUid) return;
    if (status === workout.status) return;

    if (status === WorkoutStatus.completed) {
      //don't allow in progress if not workouts
      if (
        workout.type === WorkoutTypes.TraditionalStrengthTraining &&
        (!workout.exercises || workout.exercises.length < 1)
      ) {
        setBanner('Please add an exercise.', BannerTypes.warning);
        return;
      }

      await onCompleteWorkout();
      return;
    }

    await updateWorkoutStatus(workout._id, status).catch(err => {
      console.log(err);
    });
  };

  const onCompleteWorkout = async (
    exercises?: WorkoutExerciseProps[] | void,
  ) => {
    if (!workout) return;

    if (
      workout.type === WorkoutTypes.TraditionalStrengthTraining &&
      (!workout.exercises || workout.exercises.length < 1)
    ) {
      setBanner(
        'There are no exercises in this workout. Cannot complete',
        BannerTypes.warning,
      );
      return;
    }

    const completedWorkout: WorkoutProps = {
      ...workout,
      exercises: exercises ? exercises : workout.exercises,
    };

    await completeWorkout(completedWorkout, 0, reflection, image).catch(err => {
      console.log(err);
    });
  };

  const onNavigateToAddExercise = (group: number, order: number) => {
    if (!workout) return;
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

  if (!workout) return <Loading />;

  return (
    <WorkoutProvider
      onNavigateToExercise={onNavigateToExercise}
      setImage={setImage}
      image={image}
      onCompleteWorkout={onCompleteWorkout}
      onNavigateToAddExercise={onNavigateToAddExercise}
      onUpdateStatus={onUpdateStatus}
      setReflection={setReflection}
      updateWoHealthData={onUpdateWoHealthData}>
      <ScreenTemplate
        isBackVisible
        onGoBack={onBackButtonPress}
        rightContent={
          <FlexBox flex={1} alignItems="center" justifyContent="flex-end">
            <DemoArrow state={[DemoStates.WORKOUT_VIEW_MENU]} />
            <Icon
              icon="timer"
              size={25}
              color={Colors.white}
              onPress={() => navigation.navigate(HomeStackScreens.Timer)}
            />
            {workout?.status !== WorkoutStatus.inProgress && (
              <Icon
                icon="ellipsis"
                size={20}
                color={Colors.white}
                onPress={() =>
                  navigation.navigate(HomeStackScreens.WorkoutModal)
                }
                containerStyles={{ marginLeft: 10 }}
              />
            )}
          </FlexBox>
        }>
        <DemoArrow
          state={[
            DemoStates.WORKOUT_VIEW,
            DemoStates.WORKOUT_VIEW_STATUS,
            DemoStates.WORKOUT_VIEW_CHANGE_WARM_UP,
            DemoStates.WORKOUT_VIEW_ADD_EXERCISE_BOTTOM,
            DemoStates.WORKOUT_VIEW_CHANGE_WARM_UP,
          ]}
        />
        {workout.type === WorkoutTypes.TraditionalStrengthTraining ? (
          <WorkoutContainer />
        ) : (
          <OverviewContainer />
        )}
        <WorkoutHeader program={program} />
      </ScreenTemplate>
    </WorkoutProvider>
  );
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateWorkoutStatus: async (workoutUid: string, status: WorkoutStatus) =>
      dispatch(updateWorkoutStatus(workoutUid, status)),
    completeWorkout: async (
      workout: WorkoutProps,
      strainRating: number,
      reflection: string,
      image?: ImageProps,
    ) => dispatch(completeWorkout(workout, strainRating, reflection, image)),
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

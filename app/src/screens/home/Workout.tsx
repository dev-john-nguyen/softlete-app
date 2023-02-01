import React, { useEffect, useState, Dispatch, useCallback } from 'react';
import { ReducerProps } from '../../services';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { connect, useDispatch, useSelector } from 'react-redux';
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
import DashboardDemo from '../../components/demo/Demo';
import { DemoStates } from '../../services/global/types';
import { SET_DEMO_STATE } from '../../services/global/actionTypes';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { LocationValue } from 'react-native-health';
import { handleDeviceActivityImport } from '../../helpers/route.helpers';
import { HomeWorkoutProvider } from '@app/contexts';
import { useNavigation, useRoute } from '@react-navigation/native';
import useBanner from 'src/hooks/utils/useBanner';
import { FlexBox } from '@app/ui';

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
  const { workout, demoState, genPrograms, targetProgram } = useSelector(
    (state: ReducerProps) => ({
      workout: state.workout.viewWorkout,
      genPrograms: state.program.generatedPrograms,
      targetProgram: state.program.targetProgram,
      demoState: state.global.demoState,
    }),
  );
  const dispatch = useDispatch<any>();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const setBanner = useBanner();

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

    if (status === WorkoutStatus.inProgress && demoState) {
      dispatch({ type: SET_DEMO_STATE, payload: DemoStates.WO_PROGRESS });
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

    if (demoState)
      dispatch({ type: SET_DEMO_STATE, payload: DemoStates.WO_COMPLETED });

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
    <HomeWorkoutProvider
      onNavigateToExercise={onNavigateToExercise}
      setImage={setImage}
      image={image}
      onCompleteWorkout={onCompleteWorkout}
      onNavigateToAddExercise={onNavigateToAddExercise}
      onUpdateStatus={onUpdateStatus}
      onUpdateWoHealthData={onUpdateWoHealthData}
      setReflection={setReflection}>
      <ScreenTemplate
        isBackVisible
        onGoBack={onBackButtonPress}
        rightContent={
          <FlexBox flex={1} alignItems="flex-end" justifyContent="flex-end">
            {workout?.status !== WorkoutStatus.inProgress && (
              <Icon
                icon="ellipsis"
                size={20}
                color={Colors.white}
                onPress={() =>
                  navigation.navigate(HomeStackScreens.WorkoutModal)
                }
              />
            )}
          </FlexBox>
        }>
        <DashboardDemo screen={HomeStackScreens.Workout} />
        {workout.type === WorkoutTypes.TraditionalStrengthTraining ? (
          <WorkoutContainer
            onNavigateToAddExercise={onNavigateToAddExercise}
            image={image}
            setImage={setImage}
          />
        ) : (
          <OverviewContainer
            navigation={navigation}
            workout={workout}
            updateWoHealthData={onUpdateWoHealthData}
            image={image}
            setImage={setImage}
          />
        )}
        <WorkoutHeader
          likeUids={workout.likeUids ? workout.likeUids : []}
          workout={workout}
          program={program}
          onUpdateStatus={onUpdateStatus}
        />
      </ScreenTemplate>
    </HomeWorkoutProvider>
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

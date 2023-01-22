import React, {
  useEffect,
  useState,
  Dispatch,
  useCallback,
  useLayoutEffect,
} from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import {
  WorkoutActionProps,
  WorkoutStatus,
  WorkoutExerciseProps,
  ViewWorkoutProps,
  WorkoutProps,
  WorkoutTypes,
  HealthDataProps,
} from '../../services/workout/types';
import BaseColors from '../../utils/BaseColors';
import { ExerciseProps } from '../../services/exercises/types';
import WorkoutContainer from '../../components/workout/Container';
import { ProgramActionProps, ProgramProps } from '../../services/program/types';
import {
  updateWorkoutStatus,
  completeWorkout,
  updateWoHealthData,
} from '../../services/workout/actions';
import WorkoutHeader from '../../components/workout/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import MoreSvg from '../../assets/MoreSvg';
import { normalize } from '../../utils/tools';
import StyleConstants from '../../components/tools/StyleConstants';
import Loading from '../../components/elements/Loading';
import { setBanner } from '../../services/banner/actions';
import { BannerTypes } from '../../services/banner/types';
import { ImageProps } from '../../services/user/types';
import OverviewContainer from '../../components/workout/overview/Container';
import { updateProgramWoHealthData } from '../../services/program/actions';
import { ProgramStackScreens } from './types';
import BackButton from '../../components/elements/BackButton';

interface Props {
  workout: ViewWorkoutProps;
  route: any;
  navigation: any;
  dispatch: React.Dispatch<any>;
  updateWorkoutStatus: WorkoutActionProps['updateWorkoutStatus'];
  targetProgram: ProgramProps;
  updateProgramWoHealthData: ProgramActionProps['updateProgramWoHealthData'];
}

//notes
///route params will determine if it's a new workout

const Workout = ({
  route,
  navigation,
  workout,
  updateWorkoutStatus,
  targetProgram,
  dispatch,
  updateProgramWoHealthData,
}: Props) => {
  const onBackButtonPress = () => {
    if (route.params?.goBackScreen) {
      const { workouts, ...rest } = targetProgram;
      navigation.navigate(route.params.goBackScreen, {
        program: rest,
      });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ProgramStackScreens.Templates);
    }
  };
  const disableEdit = () =>
    route.params && route.params.softlete ? true : false;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        workout?.status !== WorkoutStatus.inProgress &&
        !disableEdit() && (
          <Pressable
            style={styles.menu}
            onPress={() =>
              navigation.navigate(ProgramStackScreens.ProgramWorkoutModal)
            }>
            <MoreSvg fillColor={BaseColors.primary} />
          </Pressable>
        ),
      headerLeft: () => <BackButton onPress={onBackButtonPress} />,
    });
  }, [navigation, route, workout]);

  const onUpdateStatus = async (status: WorkoutStatus) => {
    if (!workout || workout.programTemplateUid) return;
    if (status === workout.status) return;

    if (status === WorkoutStatus.completed) {
      //don't allow in progress if not workouts
      if (
        workout.type === WorkoutTypes.TraditionalStrengthTraining &&
        (!workout.exercises || workout.exercises.length < 1)
      ) {
        return dispatch(
          setBanner(BannerTypes.warning, 'Please add an exercise.'),
        );
      }
    }

    await updateWorkoutStatus(workout._id, status).catch(err => {
      console.log(err);
    });
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
    ).catch(err => console.log(err));
  };

  const onNavigateToExercise = (exercise: ExerciseProps) => {
    navigation.navigate(ProgramStackScreens.ProgramExercise, { exercise });
  };

  if (!workout) return <Loading />;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {workout.type === WorkoutTypes.TraditionalStrengthTraining ? (
        <WorkoutContainer
          isProgramTemplate
          workout={workout}
          onNavigateToAddExercise={onNavigateToAddExercise}
          onNavigateToExercise={onNavigateToExercise}
          navigation={navigation}
          athlete={disableEdit()}
        />
      ) : (
        <OverviewContainer
          navigation={navigation}
          workout={workout}
          updateWoHealthData={onUpdateWoHealthData}
          athlete={disableEdit()}
        />
      )}
      <WorkoutHeader
        likeUids={workout.likeUids ? workout.likeUids : []}
        workout={workout}
        onUpdateStatus={onUpdateStatus}
        template
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    backgroundColor: BaseColors.white,
    zIndex: 0,
  },
  menu: {
    width: normalize.width(20),
    height: normalize.width(20),
    marginRight: StyleConstants.baseMargin,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  workout: state.program.viewWorkout,
  targetProgram: state.program.targetProgram,
});

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
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workout);

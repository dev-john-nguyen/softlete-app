import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ReducerProps } from '../../../services';
import { connect } from 'react-redux';
import { removeProgramWorkout } from '../../../services/program/actions';
import { removeWorkout } from '../../../services/workout/actions';
import { INITIATE_WORKOUT_HEADER } from '../../../services/workout/actionTypes';
import { HomeStackScreens } from '../types';
import { ProgramActionProps } from '../../../services/program/types';
import {
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutTypes,
} from '../../../services/workout/types';
import PrimaryButton from '../../../components/elements/PrimaryButton';
import WorkoutHelp from '../../../components/modal/WorkoutHelp';
import styles from '../../../components/modal/styles';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  navigation: any;
  route: any;
  dispatch: React.Dispatch<any>;
  removeWorkout: WorkoutActionProps['removeWorkout'];
  removeProgramWorkout: ProgramActionProps['removeProgramWorkout'];
  workout: ViewWorkoutProps;
}

const WorkoutModal = ({
  navigation,
  workout,
  route,
  removeProgramWorkout,
  removeWorkout,
  dispatch,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [help, setHelp] = useState(false);
  const mount = useRef(false);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const onEditWorkoutHeader = () => {
    if (!workout) return;

    const isProgram = route.params ? route.params.isProgram : false;

    dispatch({
      type: INITIATE_WORKOUT_HEADER,
      payload: {
        ...workout,
        program: isProgram,
      },
    });

    navigation.navigate(HomeStackScreens.WorkoutHeader, {
      goBackScreen: HomeStackScreens.Workout,
    });
  };

  const onDeleteWorkout = () => {
    if (!workout) return;
    setLoading(true);
    removeWorkout(workout._id)
      .then(() => mount.current && navigation.navigate(HomeStackScreens.Home))
      .catch(err => {
        console.log(err);
        if (mount.current) {
          navigation.navigate(HomeStackScreens.Home);
          setLoading(false);
        }
      });
  };

  const onRestructure = () =>
    navigation.navigate(HomeStackScreens.ReorderWorkoutExercises);

  const contentElement = useMemo(() => {
    if (confirm)
      return (
        <View>
          <PrimaryText>
            Are you sure you want to remove? You cannot restore the workout once
            removed.
          </PrimaryText>
          <FlexBox marginTop={15} width="100%">
            <PrimaryButton onPress={onDeleteWorkout} width="100%">
              Confirm Removal
            </PrimaryButton>
          </FlexBox>
        </View>
      );

    if (help) return <WorkoutHelp />;

    return (
      <View>
        <Pressable style={styles.item} onPress={onEditWorkoutHeader}>
          <PrimaryText color={Colors.white}>Edit</PrimaryText>
          <Icon icon="pencil" color={Colors.white} size={15} />
        </Pressable>

        {workout.type === WorkoutTypes.TraditionalStrengthTraining && (
          <Pressable style={styles.item} onPress={onRestructure}>
            <PrimaryText color={Colors.white}>Restructure</PrimaryText>
            <Icon icon="sort" color={Colors.white} size={15} />
          </Pressable>
        )}
        <Pressable style={styles.item} onPress={() => setHelp(true)}>
          <PrimaryText color={Colors.white}>Tips/Help</PrimaryText>
          <Icon icon="info" color={Colors.white} size={15} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setConfirm(true)}>
          <PrimaryText color={Colors.white}>Remove</PrimaryText>
          <Icon icon="trash_bin" color={Colors.white} size={15} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => navigation.goBack()}>
          <PrimaryText color={Colors.white}>Cancel</PrimaryText>
          <Icon icon="close" color={Colors.white} size={12} />
        </Pressable>
      </View>
    );
  }, [confirm, help]);

  const headerText = useMemo(() => {
    if (confirm) return 'Remove Workout';
    if (help) return 'Tips/Help';
    return 'Menu';
  }, [confirm, help]);

  const onBack = () => {
    setConfirm(false);
    setHelp(false);
  };

  return (
    <FlexBox column flex={1}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.closeContainer}
      />
      <View style={[styles.content, { marginTop: headerHeight }]}>
        <View style={styles.modal}>
          <View style={styles.headerContainer}>
            {!confirm && !help && <View />}
            <FlexBox alignItems="center" onPress={onBack}>
              {(confirm || help) && (
                <Icon
                  icon="chevron"
                  size={16}
                  color={Colors.white}
                  containerStyles={{ marginRight: 5 }}
                />
              )}
              <PrimaryText color={Colors.white} size="medium">
                {headerText}
              </PrimaryText>
            </FlexBox>
            <View />
          </View>
          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.white}
              style={styles.loading}
            />
          )}
          {contentElement}
        </View>
      </View>
    </FlexBox>
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  workout: state.workout.viewWorkout,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    removeWorkout: async (workoutUid: string) =>
      dispatch(removeWorkout(workoutUid)),
    removeProgramWorkout: async (workoutUid: string) =>
      dispatch(removeProgramWorkout(workoutUid)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutModal);

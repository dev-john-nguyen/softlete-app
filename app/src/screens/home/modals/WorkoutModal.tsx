import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { normalize } from '../../../utils/tools';
import SortSvg from '../../../assets/SortSvg';
import TrashSvg from '../../../assets/TrashSvg';
import InfoSvg from '../../../assets/InfoSvg';
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
import SecondaryButton from '../../../components/elements/SecondaryButton';
import WorkoutHelp from '../../../components/modal/WorkoutHelp';
import Chevron from '../../../assets/ChevronSvg';
import CloseSvg from '../../../assets/CloseSvg';
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
          <PrimaryText>Are you sure you want to remove?</PrimaryText>
          <View style={styles.confirmActions}>
            <PrimaryButton onPress={onDeleteWorkout}>Confirm</PrimaryButton>
            <SecondaryButton onPress={() => setConfirm(false)}>
              Cancel
            </SecondaryButton>
          </View>
        </View>
      );

    if (help) return <WorkoutHelp />;

    return (
      <View>
        <Pressable style={styles.item} onPress={onEditWorkoutHeader}>
          <PrimaryText color={Colors.primary}>Edit</PrimaryText>
          <Icon icon="pencil" color={Colors.primary} size={15} />
        </Pressable>

        {workout.type === WorkoutTypes.TraditionalStrengthTraining && (
          <Pressable style={styles.item} onPress={onRestructure}>
            <PrimaryText color={Colors.primary}>Restructure</PrimaryText>
            <Icon icon="sort" color={Colors.primary} size={15} />
          </Pressable>
        )}
        <Pressable style={styles.item} onPress={() => setHelp(true)}>
          <PrimaryText color={Colors.primary}>Tips/Help</PrimaryText>
          <Icon icon="info" color={Colors.primary} size={15} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setConfirm(true)}>
          <PrimaryText color={Colors.primary}>Remove</PrimaryText>
          <Icon icon="trash_bin" color={Colors.primary} size={15} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => navigation.goBack()}>
          <PrimaryText color={Colors.primary}>Cancel</PrimaryText>
          <Icon icon="close" color={Colors.primary} size={12} />
        </Pressable>
      </View>
    );
  }, [confirm, help]);

  const headerText = useMemo(() => {
    if (confirm) return 'Confirm';
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
            {confirm || help ? (
              <Pressable style={styles.backContainer} onPress={onBack}>
                <Chevron strokeColor={Colors.black} />
              </Pressable>
            ) : (
              <View />
            )}
            <PrimaryText color={Colors.primary} size="medium">
              {headerText}
            </PrimaryText>
            <View />
          </View>
          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
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

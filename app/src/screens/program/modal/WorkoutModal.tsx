import React, { Dispatch, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { ReducerProps } from '../../../services';
import { connect, useDispatch, useSelector } from 'react-redux';
import { removeProgramWorkout } from '../../../services/program/actions';
import { ProgramActionProps } from '../../../services/program/types';
import { ProgramStackScreens } from '../types';
import MenuModal, { MenuItemProps } from 'src/screens/modals/MenuModal';
import { SET_PROGRAM_WORKOUT_HEADER } from 'src/services/program/actionTypes';

interface Props {
  navigation: any;
  route: any;
  removeProgramWorkout: ProgramActionProps['removeProgramWorkout'];
}

const WorkoutModal = ({ navigation, removeProgramWorkout }: Props) => {
  const dispatch = useDispatch();
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.program.viewWorkout,
  }));

  const onEditWorkoutHeader = useCallback(() => {
    if (!workout) return;
    dispatch({
      type: SET_PROGRAM_WORKOUT_HEADER,
      payload: { ...workout },
    });
    navigation.navigate(ProgramStackScreens.ProgramWorkoutHeader);
  }, [dispatch, navigation, workout]);

  const onDeleteWorkout = useCallback(() => {
    const deleteHandler = () => {
      if (!workout) return;
      if (workout.programTemplateUid) {
        removeProgramWorkout(workout._id)
          .then(() => navigation.navigate(ProgramStackScreens.Program))
          .catch(err => {
            console.log(err);
            navigation.navigate(ProgramStackScreens.Program);
          });
      }
    };
    Alert.alert(
      'Confirmation',
      "Are you sure you want to delete this workout? You can't undo this action.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: deleteHandler },
      ],
    );
  }, [navigation, removeProgramWorkout, workout]);

  const menuItems = useMemo(() => {
    const options: MenuItemProps[] = [
      {
        text: 'Edit',
        icon: 'pencil',
        onPress: onEditWorkoutHeader,
      },
      {
        text: 'Restructure',
        icon: 'sort',
        onPress: () =>
          navigation.navigate(
            ProgramStackScreens.ProgramReorderWorkoutExercises,
          ),
      },
      {
        text: 'Tips/Help',
        icon: 'info',
        onPress: () =>
          navigation.navigate(ProgramStackScreens.ProgramWorkoutHelp),
      },
      {
        text: 'Remove',
        icon: 'trash_bin',
        onPress: onDeleteWorkout,
      },
    ];
    return options;
  }, [navigation, onDeleteWorkout, onEditWorkoutHeader]);

  return <MenuModal title="Menu" menuItems={menuItems} />;
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    removeProgramWorkout: async (workoutUid: string) =>
      dispatch(removeProgramWorkout(workoutUid)),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(WorkoutModal);

import React, { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { ReducerProps, ThunkAppDispatch } from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import { removeProgramWorkout } from '../../services/program/actions';
import { ProgramStackScreens } from '../program/types';
import MenuModal, { MenuItemProps } from 'src/screens/modals/MenuModal';
import { SET_PROGRAM_WORKOUT_HEADER } from 'src/services/program/actionTypes';
import { WorkoutTypes } from 'src/services/workout/types';
import { RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from 'src/screens/home/types';
import { removeWorkout } from '../../services/workout/actions';
import { INITIATE_WORKOUT_HEADER } from 'src/services/workout/actionTypes';

interface Props {
  navigation: any;
  route: RouteProp<any>;
}

const WorkoutModal = ({ navigation, route }: Props) => {
  const isProgramWorkout = route.name !== HomeStackScreens.WorkoutModal;
  const dispatch = useDispatch<ThunkAppDispatch>();
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: isProgramWorkout
      ? state.program.viewWorkout
      : state.workout.viewWorkout,
  }));

  const onEditWorkoutHeader = useCallback(() => {
    if (!workout) return;
    if (isProgramWorkout) {
      dispatch({
        type: SET_PROGRAM_WORKOUT_HEADER,
        payload: { ...workout },
      });
      navigation.navigate(ProgramStackScreens.ProgramWorkoutHeader);
    } else {
      dispatch({
        type: INITIATE_WORKOUT_HEADER,
        payload: {
          ...workout,
        },
      });
      navigation.navigate(HomeStackScreens.WorkoutHeader, {
        goBackScreen: HomeStackScreens.Workout,
      });
    }
  }, [dispatch, isProgramWorkout, navigation, workout]);

  const onDeleteWorkout = useCallback(() => {
    const deleteHandler = () => {
      if (!workout) return;
      if (isProgramWorkout) {
        if (workout.programTemplateUid) {
          dispatch(removeProgramWorkout(workout._id))
            .then(() => navigation.navigate(ProgramStackScreens.Program))
            .catch(err => {
              console.log(err);
              navigation.navigate(ProgramStackScreens.Program);
            });
        }
      } else {
        dispatch(removeWorkout(workout._id))
          .then(() => navigation.navigate(HomeStackScreens.Home))
          .catch(err => {
            console.log(err);
            navigation.navigate(HomeStackScreens.Home);
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
  }, [dispatch, isProgramWorkout, navigation, workout]);

  const onRestructure = useCallback(() => {
    if (isProgramWorkout) {
      navigation.navigate(ProgramStackScreens.ProgramReorderWorkoutExercises);
    } else {
      navigation.navigate(HomeStackScreens.ReorderWorkoutExercises);
    }
  }, [navigation, isProgramWorkout]);

  const onHelp = useCallback(() => {
    if (isProgramWorkout) {
      navigation.navigate(ProgramStackScreens.ProgramWorkoutHelp);
    } else {
      navigation.navigate(HomeStackScreens.WorkoutHelp);
    }
  }, [navigation, isProgramWorkout]);

  const menuItems = useMemo(() => {
    const options: MenuItemProps[] = [
      {
        text: 'Edit',
        icon: 'pencil',
        onPress: onEditWorkoutHeader,
      },
      {
        text: 'Tips/Help',
        icon: 'info',
        onPress: onHelp,
      },
      {
        text: 'Remove',
        icon: 'trash_bin',
        onPress: onDeleteWorkout,
      },
    ];
    if (workout.type === WorkoutTypes.TraditionalStrengthTraining) {
      options.splice(1, 0, {
        text: 'Restructure',
        icon: 'sort',
        onPress: onRestructure,
      });
    }
    return options;
  }, [
    onDeleteWorkout,
    onEditWorkoutHeader,
    onHelp,
    onRestructure,
    workout.type,
  ]);

  return <MenuModal title="Menu" menuItems={menuItems} />;
};

export default WorkoutModal;

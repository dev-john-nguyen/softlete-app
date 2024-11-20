import React, { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { ReducerProps, ThunkAppDispatch } from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import { removeProgramWorkout } from '../../services/program/actions';
import { ProgramStackScreens } from '../program/types';
import MenuModal, { MenuItemProps } from 'src/screens/modals/MenuModal';
import { SET_PROGRAM_WORKOUT_HEADER } from 'src/services/program/actionTypes';
import { WorkoutTypes } from 'src/types/workouts.types';
import { RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from 'src/screens/home/types';
import { removeWorkout } from '../../services/workout/actions';
import { INITIATE_WORKOUT_HEADER } from 'src/services/workout/actionTypes';
import { useFetchWorkout } from '../home/workout/hooks/workout.hooks';

interface Props {
  navigation: any;
  route: RouteProp<any>;
}

const WorkoutModal = ({ navigation, route }: Props) => {
  const isProgramWorkout = route.name !== HomeStackScreens.WorkoutModal;
  const dispatch = useDispatch<ThunkAppDispatch>();
  const { workout } = useFetchWorkout();

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
        workoutUid: workout._id,
      });
    }
  }, [dispatch, isProgramWorkout, navigation, workout]);

  const onDeleteWorkout = useCallback(() => {
    const deleteHandler = () => {
      if (!workout) return;
      if (isProgramWorkout) {
        if (workout.programUid) {
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
        text: 'Details',
        icon: 'notebook',
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
    return options;
  }, [onDeleteWorkout, onEditWorkoutHeader, onHelp]);

  return <MenuModal title="Menu" menuItems={menuItems} />;
};

export default WorkoutModal;

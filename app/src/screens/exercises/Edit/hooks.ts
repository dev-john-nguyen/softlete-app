import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { removeExercise } from 'src/services/exercises/actions';
import { ExerciseProps } from 'src/services/exercises/types';

export const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch<ThunkAppDispatch>();

  const alertHandler = async (): Promise<boolean> => {
    return new Promise(resolve => {
      Alert.alert(
        'Are you sure?',
        "If you confirm this action you can't undo.",
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          { text: 'Confirm', onPress: () => resolve(true) },
        ],
      );
    });
  };

  const onDelete = async (exerciseProps: ExerciseProps) => {
    if (loading) return;
    if (!exerciseProps?._id) return navigation.goBack();
    setLoading(true);
    const confirmed = await alertHandler();
    if (confirmed) await dispatch(removeExercise(exerciseProps._id));
    setLoading(false);
    return confirmed;
  };

  return { onDelete, loading };
};

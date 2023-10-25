import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps, ThunkAppDispatch } from 'src/services';
import { removeExercise } from 'src/services/exercises/actions';
import { ExerciseProps } from 'src/services/exercises/types';

export const useDelete = () => {
  const admin = useSelector((state: ReducerProps) => Boolean(state.user.admin));
  const { mutateAsync, isLoading } = useMutation(
    async (exerciseProps: ExerciseProps) => {
      const confirmed = await alertHandler(exerciseProps);
      const isSoftlete = exerciseProps.softlete && admin;
      if (confirmed)
        await dispatch(removeExercise(exerciseProps._id, isSoftlete));
      return confirmed;
    },
  );
  const navigation = useNavigation();
  const dispatch = useDispatch<ThunkAppDispatch>();

  const alertHandler = async (
    exerciseProps: ExerciseProps,
  ): Promise<boolean> => {
    const isSoftlete = exerciseProps.softlete && admin;
    return new Promise(resolve => {
      Alert.alert(
        `Are you sure?`,
        `${
          isSoftlete ? 'This is a Softlete exercise. ' : ''
        }If you confirm this action you can't undo.`,
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
    if (isLoading) return;
    if (!exerciseProps?._id) return navigation.goBack();
    return await mutateAsync(exerciseProps);
  };

  return { onDelete, loading: isLoading };
};

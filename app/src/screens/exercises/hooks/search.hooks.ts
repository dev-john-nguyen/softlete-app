import { addExerciseToWorkoutAsync } from '@app/services';
import { WorkoutExerciseProps } from '@app/types';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';

export const useAddExerciseToWorkout = (onGoBackHandler: () => void) => {
  const dispatch = useDispatch<ThunkAppDispatch>();
  const mutation = useMutation(
    async (workoutExercises: WorkoutExerciseProps[]) => {
      await dispatch(addExerciseToWorkoutAsync({ exercises: workoutExercises }))
        .unwrap()
        .then(() => {
          onGoBackHandler();
        })
        .catch(() => {
          onGoBackHandler();
        });
    },
  );
  return mutation;
};

import { ScreenTemplate } from '@app/elements';
import { useGetActiveWorkout } from '../../hooks/workout.hooks';
import { useMemo } from 'react';
import { groupWoExercisesByGroup } from '../../helpers/workout.helpers';
import ExerciseContainer from '../../components/strength/components/exercises/components/ExerciseContainer';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamsList } from 'src/screens/home/types';
import { WorkoutContextProvider } from '../../contexts';
import WorkoutEmpty from '../../components/WorkoutEmpty';

const WorkoutGroupExercises = () => {
  const workout = useGetActiveWorkout();
  const { params } =
    useRoute<RouteProp<HomeStackParamsList, 'WorkoutGroupExercises'>>();

  const groupIndex = params?.groupIndex;

  const groupedExercises = useMemo(() => {
    if (!workout) {
      return [];
    }
    const groupedWorkout = groupWoExercisesByGroup(workout);
    const targetGroup = groupedWorkout.get(groupIndex);
    if (!targetGroup) {
      return [];
    }
    return targetGroup.exercises;
  }, [groupIndex, workout]);

  if (!workout) {
    return <WorkoutEmpty />;
  }

  return (
    <WorkoutContextProvider workout={workout}>
      <ScreenTemplate isBackVisible applyContentPadding>
        {groupedExercises.map((exercise, index) => {
          return (
            <ExerciseContainer
              key={exercise._id || index}
              exercise={exercise}
              letterIndex={groupIndex}
            />
          );
        })}
      </ScreenTemplate>
    </WorkoutContextProvider>
  );
};

export default WorkoutGroupExercises;

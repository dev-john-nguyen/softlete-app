import { DragAndSortList, ItemProps, ScreenTemplate } from '@app/elements';
import { useGetActiveWorkout } from '../hooks/workout.hooks';
import { useCallback, useMemo } from 'react';
import { groupWoExercisesByGroup } from '../helpers/workout.helpers';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamsList } from 'src/screens/home/types';
import { WorkoutContextProvider } from '../contexts';
import WorkoutEmpty from '../components/WorkoutEmpty';
import { WorkoutExerciseProps } from '@app/types';
import ExerciseContainer from '../components/strength/components/exercises/components/ExerciseContainer';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { ExerciseOrderPayload, reorderExercisesAsync } from '@app/services';
import { FlexBox } from '@app/ui';

const WorkoutGroupExercises = () => {
  const workout = useGetActiveWorkout();
  const { params } =
    useRoute<RouteProp<HomeStackParamsList, 'WorkoutGroupExercises'>>();
  const dispatch = useDispatch<ThunkAppDispatch>();

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
    return targetGroup.exercises
      .sort((a, b) => a.order - b.order)
      .map(exercise => {
        return {
          id: exercise._id as string,
          data: exercise,
        };
      });
  }, [groupIndex, workout]);

  const renderItem = useCallback(
    (data: ItemProps<WorkoutExerciseProps>) => {
      return (
        <ExerciseContainer
          exercise={data.data}
          letterIndex={groupIndex}
          key={data.id}
        />
      );
    },
    [groupIndex],
  );

  const onUpdateCallback = (items: ItemProps<WorkoutExerciseProps>[]) => {
    const payloadExercises: ExerciseOrderPayload['exercises'] = {};
    items.forEach((item, i) => {
      payloadExercises[item.data._id as string] = {
        group: groupIndex, // keep it in the same group
        order: i,
      };
    });
    dispatch(reorderExercisesAsync({ exercises: payloadExercises }));
  };

  if (!workout) {
    return <WorkoutEmpty />;
  }

  return (
    <WorkoutContextProvider workout={workout}>
      <ScreenTemplate isBackVisible>
        <FlexBox paddingTop={10} flex={1}>
          <DragAndSortList
            data={groupedExercises}
            renderItem={renderItem}
            gap={10}
            updateCallback={onUpdateCallback}
          />
        </FlexBox>
      </ScreenTemplate>
    </WorkoutContextProvider>
  );
};

export default WorkoutGroupExercises;

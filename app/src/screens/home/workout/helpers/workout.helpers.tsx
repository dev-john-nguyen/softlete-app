import { WorkoutProps } from '@app/types';
import { GroupParamsProps } from '../types';

export function groupWoExercisesByGroup(workout: WorkoutProps) {
  const groupParamsByLetterIndex = new Map<number, GroupParamsProps>();
  if (!workout.exercises) {
    return groupParamsByLetterIndex;
  }

  const groupedExercise = new Map<number, GroupParamsProps>();

  workout.exercises.forEach((e, i) => {
    const groupInstance = groupedExercise.get(e.group);
    if (groupInstance) {
      groupInstance.exercises.push(e);
      groupInstance.totalExercises++;
    } else {
      groupedExercise.set(e.group, {
        exercises: [],
        totalExercises: 1,
        groupIndex: e.group,
      });
    }
  });

  Array.from(groupedExercise.entries())
    .sort((a, b) => a[0] - b[0])
    .filter(([, props]) => props.exercises.length)
    .forEach(([, props], index) => {
      groupParamsByLetterIndex.set(index, props);
    });

  return groupParamsByLetterIndex;
}

import { DateTools } from '@app/utils';
import { GoalStateProps } from './types';

export function formatHandlerOfGoalResp(goals: GoalStateProps) {
  // convert all dates to local dates
  const formattedExercises = goals.exercises.map(exercise => ({
    ...exercise,
    startDate: DateTools.UTCISOToLocalDate(exercise.startDate).toISOString(),
    endDate: DateTools.UTCISOToLocalDate(exercise.endDate).toISOString(),
  }));
  return {
    ...goals,
    exercises: formattedExercises,
  };
}

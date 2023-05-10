import { DateTools } from '@app/utils';
import {
  ExerciseGoalProps,
  GoalProps,
  GoalRespProps,
  GoalTypes,
} from './types';

export function formatHandlerOfGoalsResp(goals: GoalRespProps[]) {
  const formattedGoals: GoalProps[] = goals.map(formatHandlerOfGoalResp);

  const userGoals = {
    exercises: formattedGoals.filter(
      g => g.type === GoalTypes.exercise,
    ) as ExerciseGoalProps[],
    endurances: formattedGoals.filter(g => g.type === GoalTypes.endurance),
    healths: formattedGoals.filter(g => g.type === GoalTypes.health),
  };

  return userGoals;
}

export function formatHandlerOfGoalResp(goal: GoalRespProps) {
  return {
    ...goal,
    startDate: goal.startDate
      ? DateTools.UTCISOToLocalDate(goal.startDate).toISOString()
      : undefined,
    endDate: goal.endDate
      ? DateTools.UTCISOToLocalDate(goal.endDate).toISOString()
      : undefined,
  };
}

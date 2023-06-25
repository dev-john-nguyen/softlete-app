import { DateTools } from '@app/utils';
import { GoalProps, GoalRespProps, GoalTypes } from './types';

export function formatHandlerOfGoalsResp(goals: GoalRespProps[]) {
  const formattedGoals: GoalProps[] = goals.map(formatHandlerOfGoalResp);

  const userGoals = {
    exercises: formattedGoals.filter(
      g => g.type === GoalTypes.exercise,
    ) as GoalProps[],
    endurances: formattedGoals.filter(g => g.type === GoalTypes.endurance),
    healths: {
      activeCalories: formattedGoals.filter(
        g => g.type === GoalTypes.active_calories,
      )[0],
      sleep: formattedGoals.filter(g => g.type === GoalTypes.sleep)[0],
    },
  };

  return userGoals;
}

export function formatHandlerOfGoalResp(goal: GoalRespProps) {
  return {
    ...goal,
    startDate: goal.startDate
      ? DateTools.UTCISOToLocalDate(goal.startDate).toISOString()
      : '',
    endDate: goal.endDate
      ? DateTools.UTCISOToLocalDate(goal.endDate).toISOString()
      : '',
  };
}

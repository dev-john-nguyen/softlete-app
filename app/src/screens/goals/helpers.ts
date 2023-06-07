import { Colors, DateTools, rgba } from '@app/utils';
import { GoalProps, GoalStatus } from 'src/services/goals/types';

export function getGoalStatus(goal: GoalProps) {
  const today = new Date();
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);

  if (DateTools.compareTwoDates(today, startDate) === 'before') {
    return {
      status: GoalStatus.pending,
      color: rgba(Colors.whiteRbg, 0.5),
      icon: 'pause',
    };
  } else if (DateTools.compareTwoDates(today, endDate) === 'after') {
    return {
      status: GoalStatus.completed,
      color: Colors.green,
      icon: 'checked',
    };
  } else {
    return {
      status: GoalStatus.inProgress,
      color: Colors.white,
      icon: 'ellipsis',
    };
  }
}

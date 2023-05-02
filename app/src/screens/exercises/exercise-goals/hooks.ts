import { DateTools, getRequestURL, PATHS } from '@app/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { ExerciseProps } from 'src/services/exercises/types';
import { ExerciseGoalProps } from 'src/services/goals/types';
import { WorkoutExerciseProps } from 'src/services/workout/types';

export const useGoalExerciseAnalytics = (
  goal: ExerciseGoalProps,
  exercise: ExerciseProps,
) => {
  const fetchAnalytics = useCallback(async () => {
    const startDateStr = DateTools.convertLocalStrToFormatStr(
      goal.startDate,
      undefined,
      'm',
    );
    const endDateSTr = DateTools.convertLocalStrToFormatStr(
      goal.endDate,
      undefined,
      'm',
    );
    return axios
      .get(
        getRequestURL(
          PATHS.goals.get_exercise_goal_analytics(
            exercise._id as string,
            String(goal.goal),
            startDateStr,
            endDateSTr,
          ),
        ),
        {
          params: { exerciseUid: exercise._id },
        },
      )
      .then(res => res.data);
  }, [goal, exercise]);

  const { data = [], isFetching } = useQuery<WorkoutExerciseProps[]>(
    [
      'exercise-goals-data',
      {
        exerciseUid: exercise._id,
        goalUid: goal._id,
        startDate: goal.startDate,
        endDate: goal.endDate,
      },
    ],
    fetchAnalytics,
    {
      refetchOnMount: true,
      staleTime: 60000,
    },
  );

  return { data, isFetching };
};

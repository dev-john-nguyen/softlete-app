import { DateTools, getRequestURL, PATHS } from '@app/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';
import { ExerciseProps } from 'src/services/exercises/types';
import { GoalProps, GoalSubTypes } from 'src/services/goals/types';
import { RespHealthDataProps, RespWorkoutExerciseProps } from './types';

export const useGoalEnduranceAnalytics = (goal: GoalProps) => {
  const request = useCallback(async () => {
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
    const url = getRequestURL(
      PATHS.goals.endurance_goal_analytics(
        goal.goal,
        startDateStr,
        endDateSTr,
        goal.subType as GoalSubTypes,
      ),
    );
    return axios.get(url).then(res => res.data);
  }, [goal]);
  const { data = [], isFetching } = useQuery<RespHealthDataProps[]>(
    [
      'exercise-goals-data',
      {
        goalUid: goal._id,
        startDate: goal.startDate,
        endDate: goal.endDate,
        updatedAt: goal.updatedAt,
      },
    ],
    request,
    {
      refetchOnMount: 'always',
      staleTime: 60000,
    },
  );
  return { data, isFetching };
};

export const useGoalExerciseAnalytics = (
  goal: GoalProps,
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

  const { data = [], isFetching } = useQuery<RespWorkoutExerciseProps[]>(
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

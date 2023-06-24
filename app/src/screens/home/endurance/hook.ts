import { DateTools, PATHS } from '@app/utils';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
  DateSelectionTypes,
  SelectedDateProps,
} from 'src/components/analytics/types';
import request from 'src/services/utils/request';
import { HealthDataAnalytics } from './types';

export const useEnduranceAnalytics = (
  enduranceType: string,
  dateFilterType: DateSelectionTypes,
  selectedDates: SelectedDateProps[],
) => {
  const dispatch = useDispatch();
  const dates = selectedDates.map(d => DateTools.dateToStr(d.date));
  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery<HealthDataAnalytics[]>(
    ['endurance-analytics'],
    async () => {
      return request(
        'GET',
        PATHS.workouts.getHealthAnalytics(
          enduranceType.toLowerCase(),
          dateFilterType,
          dates,
        ),
        dispatch,
      ).then(({ data }) => data as HealthDataAnalytics[]);
    },
    {
      enabled: false,
    },
  );

  return { data, isFetching, refetch };
};

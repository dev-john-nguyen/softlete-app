import { PATHS } from '@app/utils';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { DateSelectionTypes } from 'src/components/analytics/types';
import request from 'src/services/utils/request';
import { HealthDataAnalytics } from './types';

type Payload = {
  enduranceType: string;
  dateFilterType: DateSelectionTypes;
  dates: string[];
};

export const useMutateEnduranceAnalytics = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    data = [],
    mutateAsync,
  } = useMutation((payload: Payload) => {
    return request(
      'GET',
      PATHS.workouts.getHealthAnalytics(
        payload.enduranceType.toLowerCase(),
        payload.dateFilterType,
        payload.dates,
      ),
      dispatch,
    ).then(({ data }) => data as HealthDataAnalytics[]);
  });

  return { isLoading, data, mutateAsync };
};

import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { useMutation } from '@tanstack/react-query';
import React, { FC, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { HealthDataProps, WorkoutProps } from 'src/types/workouts.types';
import HealthContainer from '../overview/HealthContainer';
import { Colors } from '@app/utils';

interface ImportItemProps {
  onImportData: (data: HealthDataProps) => Promise<void>;
  data: HealthDataProps;
  workout: WorkoutProps;
}

const DeviceHealthImportItem: FC<ImportItemProps> = ({
  data,
  onImportData,
  workout,
}) => {
  const isWorkoutData = workout.healthData?.activityId === data.activityId;
  const { isLoading, mutateAsync } = useMutation(() => {
    return onImportData(data);
  });

  const formattedData: HealthDataProps = useMemo(() => {
    return {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      activityId: data.activityId,
      heartRates: data.heartRates,
      date: data.date,
    };
  }, [data]);

  return (
    <FlexBox column marginBottom={10}>
      <FlexBox
        alignSelf="flex-end"
        justifyContent="flex-end"
        marginBottom={5}
        alignItems="center"
        paddingBottom={5}
        paddingTop={5}>
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Icon
            icon={isWorkoutData ? 'checkmark' : 'download'}
            onPress={() => !isWorkoutData && mutateAsync()}
            size={20}
            color={Colors[isWorkoutData ? 'green' : 'white']}
          />
        )}
      </FlexBox>
      <HealthContainer data={formattedData} />
    </FlexBox>
  );
};

export default DeviceHealthImportItem;

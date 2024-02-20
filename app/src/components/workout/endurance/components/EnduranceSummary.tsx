import React from 'react';
import { useWorkoutState } from '@app/contexts';
import WorkoutTracker from 'src/classes/WorkoutTracker';
import ActivitySummary from 'src/components/ActivitySummary';
import { getWoRouteSamples } from 'src/helpers/health.helpers';
import { FlexBox } from '@app/ui';
import { WorkoutStatus } from 'src/services/workout/types';
import { Colors } from '@app/utils';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';
import { PrimaryText } from '@app/elements';

const EnduranceSummary = () => {
  const { workout } = useWorkoutState();
  const { data: workoutTracker = new WorkoutTracker(), isFetching } = useQuery(
    ['init-workout-tracker-endurance-summary', { workout }],
    async () => {
      const tracker = new WorkoutTracker();
      if (!workout.healthData) return tracker;
      tracker.initializeHealthData(workout.healthData);
      if (workout.healthData.activityId) {
        await getWoRouteSamples(workout.healthData.activityId)
          .then(routeSamples => {
            tracker.initializeLocations(routeSamples.data.locations);
          })
          .catch(e => console.log(e));
      }
      return tracker;
    },
    {
      refetchOnMount: true,
    },
  );

  return (
    <FlexBox
      column
      flex={1}
      paddingBottom={5}
      alignItems="center"
      justifyContent="center">
      {isFetching ? (
        <>
          <PrimaryText size="medium" marginBottom={10}>
            Loading workout
          </PrimaryText>
          <ActivityIndicator size="large" color={Colors.white} />
        </>
      ) : (
        <ActivitySummary
          workout={workoutTracker}
          hideDate
          applyPadding={false}
          iconColor={
            workout.status === WorkoutStatus.completed
              ? Colors.green
              : Colors.white
          }
        />
      )}
    </FlexBox>
  );
};

export default EnduranceSummary;

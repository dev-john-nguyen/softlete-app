import { ScreenTemplate } from '@app/elements';
import React from 'react';
import ActivitySummary from 'src/components/ActivitySummary';
import { useRouteMarkers } from 'src/hooks/workout/route.hooks';

const WorkoutActivitySummary = () => {
  const { workoutTracker } = useRouteMarkers();
  return (
    <ScreenTemplate
      isBackVisible
      isLoading={!workoutTracker.workoutId}
      headerTitleFormatted="Running">
      <ActivitySummary workout={workoutTracker} />
    </ScreenTemplate>
  );
};

export default WorkoutActivitySummary;

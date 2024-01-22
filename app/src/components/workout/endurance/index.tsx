import { useWorkoutState } from '@app/contexts';
import { FlexBox } from '@app/ui';
import React, { useState } from 'react';
import EnduranceForm from './components/EnduranceForm';

const EnduranceWrapper = () => {
  const { workout } = useWorkoutState();
  const [edit, setEdit] = useState(false);
  const hasHealthData = Boolean(workout.healthData);

  return (
    <FlexBox column flex={1} zIndex={100} margin={15} marginTop={10}>
      {edit || (Boolean(hasHealthData) && <EnduranceForm />)}
    </FlexBox>
  );
};

export default EnduranceWrapper;

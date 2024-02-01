import { useWorkoutState } from '@app/contexts';
import { FlexBox } from '@app/ui';
import React, { useEffect, useState } from 'react';
import EnduranceForm from './components/EnduranceForm';
import EnduranceSummary from './components/EnduranceSummary';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { PrimaryText } from '@app/elements';

const EnduranceWrapper = () => {
  const { workout } = useWorkoutState();
  const [edit, setEdit] = useState(false);
  const hasHealthData = Boolean(workout.healthData);

  useEffect(() => {
    setEdit(hasHealthData ? false : true);
  }, [hasHealthData]);

  const onChangeEditHandler = () => {
    setEdit(editState => {
      if (editState) {
        return hasHealthData ? false : true;
      }
      return !editState;
    });
  };

  return (
    <FlexBox column flex={1} zIndex={100} margin={15} marginTop={10}>
      {hasHealthData && (
        <FlexBox
          alignSelf="flex-start"
          alignItems="center"
          marginBottom={10}
          padding={10}
          borderWidth={1}
          borderRadius={10}
          onPress={onChangeEditHandler}
          borderColor={Colors.white}>
          <Icon
            icon={edit ? 'notebook' : 'pencil'}
            size={20}
            color={Colors.white}
          />
          <PrimaryText marginLeft={5}>
            {edit ? 'View Summary' : 'Edit Summary'}
          </PrimaryText>
        </FlexBox>
      )}
      {edit ? <EnduranceForm setEdit={setEdit} /> : <EnduranceSummary />}
    </FlexBox>
  );
};

export default EnduranceWrapper;

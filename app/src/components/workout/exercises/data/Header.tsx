import React from 'react';
import { WorkoutStatus } from '../../../../services/workout/types';
import { MeasSubCats } from '../../../../services/exercises/types';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';

interface Props {
  status: WorkoutStatus;
  measSubCat: MeasSubCats;
}

const ExerciseDataHeader = ({ status, measSubCat }: Props) => {
  return (
    <FlexBox width="100%" marginBottom={5} paddingLeft={15} paddingRight={15}>
      <FlexBox flex={0.5}>
        <PrimaryText size="medium">Sets</PrimaryText>
      </FlexBox>
      <FlexBox flex={1}>
        <PrimaryText size="medium">Reps</PrimaryText>
      </FlexBox>
      <FlexBox flex={1}>
        <PrimaryText size="medium" textTransform="capitalize">
          {measSubCat ? measSubCat : 'Pounds'}
        </PrimaryText>
      </FlexBox>
      <FlexBox flex={1}>
        <PrimaryText size="medium" textTransform="capitalize">
          {status !== WorkoutStatus.inProgress ? 'Percent' : ''}
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default ExerciseDataHeader;

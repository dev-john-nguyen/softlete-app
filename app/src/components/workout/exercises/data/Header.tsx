import React from 'react';
import { WorkoutStatus } from '../../../../services/workout/types';
import { MeasSubCats } from '../../../../services/exercises/types';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { SET_COLUMN_WIDTHS } from './constants';

interface Props {
  status: WorkoutStatus;
  measSubCat: MeasSubCats;
}

const ExerciseDataHeader = ({ status, measSubCat }: Props) => {
  return (
    <FlexBox width="100%" marginBottom={10} paddingLeft={15} paddingRight={15}>
      <FlexBox flex={SET_COLUMN_WIDTHS.one} marginRight={10}></FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.two} marginRight={10}>
        <PrimaryText size="medium">Reps</PrimaryText>
      </FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.three} marginRight={10}>
        <PrimaryText size="medium" textTransform="capitalize">
          {measSubCat ? measSubCat : 'Pounds'}
        </PrimaryText>
      </FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.four}>
        <PrimaryText size="medium" textTransform="capitalize">
          Percent
        </PrimaryText>
      </FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.five}></FlexBox>
    </FlexBox>
  );
};

export default ExerciseDataHeader;

import React from 'react';
import { WorkoutStatus } from '../../../../types/workouts.types';
import { MeasSubCats } from '../../../../types/exercises.types';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { SET_COLUMN_WIDTHS } from './constants';
import { moderateScale } from '@app/utils';

interface Props {
  status: WorkoutStatus;
  measSubCat: MeasSubCats;
}

const ExerciseDataHeader = ({ status, measSubCat }: Props) => {
  return (
    <FlexBox width="100%" marginBottom={10} paddingLeft={15} paddingRight={15}>
      <FlexBox flexBasis={moderateScale(30)} flexShrink={1} marginRight={10} />
      <FlexBox flex={SET_COLUMN_WIDTHS.two} marginRight={10}>
        <PrimaryText opacity={0.8} size={12}>
          Reps
        </PrimaryText>
      </FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.three} marginRight={10}>
        <PrimaryText textTransform="capitalize" opacity={0.8} size={12}>
          {measSubCat ? measSubCat : 'Pounds'}
        </PrimaryText>
      </FlexBox>
      <FlexBox flex={SET_COLUMN_WIDTHS.four} marginRight={10}>
        <PrimaryText textTransform="capitalize" opacity={0.8} size={12}>
          Percent
        </PrimaryText>
      </FlexBox>
      <FlexBox flexBasis={moderateScale(38)} />
    </FlexBox>
  );
};

export default ExerciseDataHeader;

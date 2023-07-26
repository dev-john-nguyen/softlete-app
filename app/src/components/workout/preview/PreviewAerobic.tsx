import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import {
  convertTimeToFormatTime,
  renderCalories,
  renderDistance,
  renderHeartRateAvg,
} from '@app/utils';
import React from 'react';
import { HealthDataProps } from '../../../services/workout/types';

interface ItemProps {
  text: string;
  label: string;
}

const Item = ({ text, label }: ItemProps) => {
  return (
    <FlexBox
      justifyContent="space-between"
      alignItems="center"
      marginBottom={5}>
      <PrimaryText size="small">{label}</PrimaryText>
      <PrimaryText size="small">{text}</PrimaryText>
    </FlexBox>
  );
};

interface Props {
  data?: HealthDataProps;
  color: string;
}

const PreviewAerobic = ({ data, color }: Props) => {
  return (
    <FlexBox column>
      <Item
        text={data ? renderCalories(data.calories) : '0 kcal'}
        label="Cals Burned"
      />
      <Item
        label="Duration"
        text={
          data
            ? (convertTimeToFormatTime(
                data.duration,
                undefined,
                'sec',
              ) as string)
            : '0 sec'
        }
      />
      <Item
        label="Distance"
        text={`${data ? renderDistance(data.distance) : 0} ${
          data?.disMeas ? data.disMeas : 'mi'
        }`}
      />
      <Item
        label="Avg Heart Rate"
        text={`${data ? renderHeartRateAvg(data.heartRates) : 0} bpm`}
      />
    </FlexBox>
  );
};

export default PreviewAerobic;

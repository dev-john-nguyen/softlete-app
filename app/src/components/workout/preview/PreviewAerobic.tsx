import { PrimaryText } from '@app/elements';
import Icon, { IconOptions } from '@app/icons';
import { FlexBox } from '@app/ui';
import {
  convertMsToTime,
  renderCalories,
  renderDistance,
  renderHeartRateAvg,
} from '@app/utils';
import React from 'react';
import { HealthDataProps } from '../../../services/workout/types';

interface ItemProps {
  icon: IconOptions;
  text: string;
  color: string;
}

const Item = ({ text, color, icon }: ItemProps) => {
  return (
    <FlexBox
      justifyContent="space-between"
      alignItems="center"
      marginBottom={5}>
      <PrimaryText size="small">{text}</PrimaryText>
      <Icon icon={icon} size={15} color={color} />
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
        icon="fire"
        text={data ? renderCalories(data.calories) : '0 kcal'}
        color={color}
      />
      <Item
        icon="clock"
        text={data ? convertMsToTime(data.duration) : '0 sec'}
        color={color}
      />
      <Item
        icon="ruler"
        text={`${data ? renderDistance(data.distance) : 0} ${
          data?.disMeas ? data.disMeas : 'mi'
        }`}
        color={color}
      />
      <Item
        icon="heart"
        text={`${data ? renderHeartRateAvg(data.heartRates) : 0} bpm`}
        color={color}
      />
    </FlexBox>
  );
};

export default PreviewAerobic;

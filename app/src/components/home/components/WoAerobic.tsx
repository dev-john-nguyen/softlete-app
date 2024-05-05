import { InfoListBox } from '@app/elements';
import { TimeConverter } from '@app/utils';
import React from 'react';
import { HealthDataProps } from '../../../types/workouts.types';
import {
  renderDistance,
  renderHeartRateAvg,
  renderCalories,
  renderDate,
} from '../../../utils/format';

interface Props {
  healthData?: HealthDataProps;
  color: string;
  onPress?: () => void;
  showDate?: boolean;
  onViewRoute?: () => void;
  onViewSummary?: () => void;
  disablePressIcon?: boolean;
}

const WoAerobic = ({
  healthData,
  onPress,
  color,
  showDate,
  onViewRoute,
  onViewSummary,
  disablePressIcon,
}: Props) => {
  const getDateAsString = () => {
    if (!healthData || !healthData.end) return '12/31/9999';
    return renderDate(healthData.end);
  };

  return (
    <>
      {showDate && (
        <InfoListBox
          icon="calendar"
          desc={getDateAsString()}
          onPress={onPress}
          color={color}
          disablePressIcon={disablePressIcon}
        />
      )}
      <InfoListBox
        icon="clock"
        color={color}
        onPress={onPress}
        disablePressIcon={disablePressIcon}
        desc={
          healthData
            ? (TimeConverter.convertSecondsToTimeFormat(
                healthData.duration,
              ) as string)
            : '0 sec'
        }
      />

      <InfoListBox
        icon="ruler"
        desc={`${healthData ? renderDistance(healthData.distance) : 0} ${
          healthData?.disMeas ? healthData.disMeas : 'mi'
        }`}
        onPress={onPress}
        disablePressIcon={disablePressIcon}
        color={color}
      />

      <InfoListBox
        icon="heart"
        desc={`${renderHeartRateAvg(healthData?.heartRates)} bpm`}
        onPress={onPress}
        disablePressIcon={disablePressIcon}
        color={color}
      />

      <InfoListBox
        icon="fire"
        desc={healthData ? renderCalories(healthData.calories) : '0 kcal'}
        onPress={onPress}
        disablePressIcon={disablePressIcon}
        color={color}
      />

      <InfoListBox
        icon="notebook"
        desc="View Summary"
        disablePressIcon={disablePressIcon}
        onPress={onViewSummary}
        color={color}
      />

      {onViewRoute && (
        <InfoListBox
          icon="compass"
          desc={'View Map'}
          onPress={onViewRoute}
          disablePressIcon={disablePressIcon}
          color={color}
        />
      )}
    </>
  );
};

export default WoAerobic;

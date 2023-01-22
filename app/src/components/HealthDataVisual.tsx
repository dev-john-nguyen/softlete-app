import { PrimaryText } from '@app/elements';
import Icon, { IconOptions } from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import React from 'react';

interface HealthItemProps {
  title: string;
  onPress: () => void;
  icon: IconOptions;
  value: string;
  isActive: boolean;
}

const HealthItem = ({
  title,
  onPress,
  icon,
  value,
  isActive,
}: HealthItemProps) => {
  return (
    <FlexBox
      flex={1}
      flexDirection="column"
      marginRight={1}
      marginLeft={1}
      justifyContent="center"
      alignItems="center"
      padding={10}
      backgroundColor={
        isActive
          ? rgba(Colors.lightWhiteRgb, 0.3)
          : rgba(Colors.lightWhiteRgb, 0.1)
      }
      onPress={onPress}>
      <Icon icon={icon} size={20} color={Colors.white} />
      <PrimaryText size="small" marginTop={5}>
        {title}
      </PrimaryText>
      <PrimaryText size="small">{value}</PrimaryText>
    </FlexBox>
  );
};

interface Props {
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  activeItem: string;
  recoveryVal?: string;
  rhrVal?: string;
  sleepVal?: string;
  hrvVal?: string;
  rrVal?: string;
}

const HealthDataVisual = ({
  setActiveItem,
  activeItem,
  recoveryVal,
  sleepVal = '0',
  hrvVal = '0',
  rrVal = '0',
  rhrVal = '0',
}: Props) => {
  return (
    <FlexBox alignItems="stretch">
      {recoveryVal ? (
        <HealthItem
          title="RCVY"
          icon="heart"
          onPress={() => setActiveItem('recovery')}
          isActive={activeItem === 'recovery'}
          value={recoveryVal + '%'}
        />
      ) : (
        <HealthItem
          title="RHR"
          icon="heart"
          onPress={() => setActiveItem('rhr')}
          isActive={activeItem === 'rhr'}
          value={(rhrVal ? rhrVal : '0') + ' bpm'}
        />
      )}
      <HealthItem
        title="Sleep"
        icon="crescent_moon"
        onPress={() => setActiveItem('sleep')}
        isActive={activeItem === 'sleep'}
        value={(sleepVal || 0) + ' hrs'}
      />
      <HealthItem
        title="HRV"
        icon="graph_two"
        onPress={() => setActiveItem('hrv')}
        isActive={activeItem === 'hrv'}
        value={hrvVal + ' ms'}
      />
      <HealthItem
        title="RR"
        icon="candles"
        onPress={() => setActiveItem('rr')}
        isActive={activeItem === 'rr'}
        value={rrVal + ' rr'}
      />
    </FlexBox>
  );
};

export default HealthDataVisual;

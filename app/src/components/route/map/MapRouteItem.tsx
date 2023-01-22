import { PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { MarkerProps } from '../../../../types/route/route.types';

interface Props extends MarkerProps {
  onPress: () => void;
  active: boolean;
}

const MapRouteContent = ({
  name,
  value,
  icon,
  onPress,
  color,
  active,
}: Props) => {
  return (
    <FlexBox
      padding={10}
      borderRadius={5}
      backgroundColor={Colors.primary}
      alignItems="center"
      justifyContent="center"
      color={color ? color : Colors.primary}
      opacity={active ? 1 : 0.5}
      onPress={onPress}
      marginRight={5}
      column>
      <Icon icon={icon} size={25} color={Colors.white} />
      <PrimaryText size="small" marginTop={5}>
        {name}
      </PrimaryText>
      <PrimaryText size="small">{value}</PrimaryText>
    </FlexBox>
  );
};

export default MapRouteContent;

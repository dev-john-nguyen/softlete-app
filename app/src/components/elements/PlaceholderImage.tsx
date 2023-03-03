import React, { FC } from 'react';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';

type Props = {
  size?: number;
};

const PlaceholderImage: FC<Props> = ({ size = 50 }) => {
  return (
    <FlexBox
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center">
      <Icon icon="logo" size={size} variant="secondary" opacity={0.9} />
    </FlexBox>
  );
};

export default PlaceholderImage;

import React from 'react';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';

import { Colors, rgba } from '@app/utils';
import { FC } from 'react';
import { StyleProp } from 'react-native';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';

type Props = {
  message: string;
  duration?: number;
};

const ToolTip: FC<Props & StyleProp<any>> = ({
  message,
  duration,
  ...styles
}) => {
  const setBanner = useBanner();

  const onPressHandler = () => {
    setBanner(message, BannerTypes.default, duration);
  };

  return (
    <FlexBox {...styles}>
      <Icon
        icon="info"
        color={rgba(Colors.lightWhiteRgb, 0.5)}
        onPress={onPressHandler}
        size={20}
      />
    </FlexBox>
  );
};

export default ToolTip;

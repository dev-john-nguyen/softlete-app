import React from 'react';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { useState } from 'react';
import { Colors, rgba } from '@app/utils';
import { FC } from 'react';
import { StyleProp } from 'react-native';
import PrimaryText from './PrimaryText';

type Props = {
  message: string;
};

const ToolTip: FC<Props & StyleProp<any>> = ({ message, ...styles }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <FlexBox {...styles}>
      {isVisible && (
        <FlexBox>
          <PrimaryText>{message}</PrimaryText>
        </FlexBox>
      )}
      <Icon
        icon="info"
        color={rgba(Colors.lightWhiteRgb, 0.5)}
        onPressIn={() => setIsVisible(true)}
        onPressOut={() => setIsVisible(false)}
        size={20}
      />
    </FlexBox>
  );
};

export default ToolTip;

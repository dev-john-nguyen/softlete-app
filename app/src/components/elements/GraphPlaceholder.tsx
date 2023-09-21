import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import Icon from '@app/icons';
import PrimaryText from './PrimaryText';

type Props = {
  hasBgColor?: boolean;
};

const GraphPlaceholder: FC<Props> = ({ hasBgColor = true }) => {
  return (
    <FlexBox
      width="100%"
      height="100%"
      alignItems="center"
      backgroundColor={hasBgColor ? rgba(Colors.whiteRbg, 0.1) : undefined}
      borderRadius={5}
      justifyContent="center">
      <FlexBox alignItems="center" bottom={30}>
        <Icon icon="bar_chart" size={25} color={Colors.white} />
        <PrimaryText marginLeft={5}>Not Enough Data</PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default GraphPlaceholder;

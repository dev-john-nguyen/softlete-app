import React from 'react';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import Icon from '@app/icons';
import PrimaryText from './PrimaryText';

const GraphPlaceholder = () => {
  return (
    <FlexBox
      width="100%"
      height="100%"
      alignItems="center"
      backgroundColor={rgba(Colors.whiteRbg, 0.1)}
      borderRadius={5}
      justifyContent="center">
      <FlexBox alignItems="center">
        <Icon icon="bar_chart" size={25} color={Colors.white} />
        <PrimaryText marginLeft={5}>Not Enough Data</PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default GraphPlaceholder;

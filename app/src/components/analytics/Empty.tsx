import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import PrimaryText from '../elements/PrimaryText';

const Empty = () => {
  return (
    <FlexBox column flex={1} marginTop={50} alignItems="center">
      <FlexBox alignItems="center" justifyContent="center">
        <FlexBox position="absolute" zIndex={-1} opacity={0.1}>
          <Icon icon="database" color={Colors.white} size={50} />
        </FlexBox>
        <PrimaryText size="medium" marginLeft={5}>
          Not Enough Data
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default Empty;

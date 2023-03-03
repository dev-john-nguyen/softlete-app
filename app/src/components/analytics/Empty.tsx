import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import PrimaryText from '../elements/PrimaryText';

const Empty = () => {
  return (
    <FlexBox column flex={1} marginTop={20} alignItems="center">
      <FlexBox alignItems="center">
        <Icon icon="database" color={Colors.white} size={30} />
        <PrimaryText size="medium" marginLeft={5}>
          Not Enough Data
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default Empty;

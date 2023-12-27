import React from 'react';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';

const WarmUp = () => {
  return (
    <FlexBox
      width="100%"
      marginBottom={10}
      alignItems="center"
      justifyContent="space-between"
      opacity={0.5}>
      <FlexBox
        height={1}
        width="30%"
        borderRadius={100}
        backgroundColor={Colors.lightGrey}
      />
      <PrimaryText color={Colors.lightWhite} size="small">
        End Warm Up
      </PrimaryText>
      <FlexBox
        height={1}
        width="30%"
        borderRadius={100}
        backgroundColor={Colors.lightGrey}
      />
    </FlexBox>
  );
};

export default WarmUp;

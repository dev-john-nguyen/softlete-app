import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
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
      backgroundColor={hasBgColor ? Colors.lightPrimary : undefined}
      borderRadius={5}
      justifyContent="center">
      <FlexBox position="absolute" zIndex={-1} opacity={0.1}>
        <Icon icon="graph_two" size={50} color={Colors.white} />
      </FlexBox>
      <FlexBox alignItems="center" bottom={10}>
        <PrimaryText marginLeft={5} size="medium">
          Not Enough Data
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default GraphPlaceholder;

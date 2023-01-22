import React from 'react';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import Icon from '@app/icons';

const GraphPlaceholder = () => {
  return (
    <FlexBox
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      borderLeftWidth={1}
      borderLeftColor={rgba(Colors.whiteRbg, 0.5)}
      borderBottomColor={rgba(Colors.whiteRbg, 0.5)}
      borderBottomWidth={1}>
      <Icon icon="hide" size={20} color={rgba(Colors.whiteRbg, 0.5)} />
    </FlexBox>
  );
};

export default GraphPlaceholder;

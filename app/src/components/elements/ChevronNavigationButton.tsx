import React from 'react';
import { PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';

type Props = {
  onPress: () => void;
  right?: boolean;
  label: string;
  alignSelf?: string;
  marginBottom?: number;
};

const ChevronNavigationButton: React.FC<Props> = ({
  onPress,
  right,
  label,
  alignSelf = 'flex-end',
  marginBottom,
}) => {
  return (
    <FlexBox
      borderWidth={1}
      borderColor={Colors.white}
      padding={6}
      paddingRight={right ? 12 : 15}
      paddingLeft={right ? 15 : 12}
      borderRadius={100}
      alignSelf={alignSelf}
      marginBottom={marginBottom}
      alignItems="center"
      onPress={onPress}>
      {!right && (
        <Icon
          icon={'chevron'}
          size={15}
          color={Colors.white}
          direction="left"
        />
      )}
      <PrimaryText
        marginRight={right ? 5 : undefined}
        marginLeft={right ? undefined : 5}>
        {label}
      </PrimaryText>
      {right && (
        <Icon
          icon={'chevron'}
          size={15}
          color={Colors.white}
          direction="right"
        />
      )}
    </FlexBox>
  );
};

export default ChevronNavigationButton;

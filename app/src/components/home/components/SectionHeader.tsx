import React from 'react';
import { PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';

interface Props {
  title: string;
  desc: string;
  RightElement?: JSX.Element;
}

const SectionHeader = ({ title, desc, RightElement }: Props) => {
  return (
    <FlexBox flexDirection="column">
      <FlexBox justifyContent="space-between" alignItems="center">
        <PrimaryText
          size="medium"
          variant="secondary"
          color={Colors.white}
          textAlign="center"
          bold>
          {title}
        </PrimaryText>
        {RightElement}
      </FlexBox>
      <FlexBox alignItems="center" marginTop={10}>
        <Icon icon="logo" size={25} variant="secondary" />
        <PrimaryText
          variant="secondary"
          size="small"
          color={Colors.white}
          flex={1}
          marginLeft={5}>
          {desc}
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default SectionHeader;

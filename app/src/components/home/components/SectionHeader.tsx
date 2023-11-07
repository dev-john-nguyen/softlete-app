import React from 'react';
import { DemoArrow, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { DemoStates } from '@app/services';

interface Props {
  title: string;
  desc: string;
  RightElement?: JSX.Element;
}

const SectionHeader = ({ title, desc, RightElement }: Props) => {
  return (
    <FlexBox flexDirection="column">
      <DemoArrow
        state={[
          DemoStates.HOME_WORKOUS_TODAY_WORKOUT,
          DemoStates.HOME_WORKOUT_TODAY_PRESS,
        ]}
      />
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
      <FlexBox alignItems="center">
        <PrimaryText
          variant="secondary"
          size="small"
          color={Colors.white}
          flex={1}>
          {desc}
        </PrimaryText>
      </FlexBox>
    </FlexBox>
  );
};

export default SectionHeader;

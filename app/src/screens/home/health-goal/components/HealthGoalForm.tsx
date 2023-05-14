import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import React from 'react';

const HealthGoalForm = () => {
  return (
    <ScreenTemplate
      isBackVisible
      leftContentFlex={0}
      rightContentFlex={0}
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText size="large" variant="primary">
            Health Goals
          </PrimaryText>
        </FlexBox>
      }>
      <FlexBox column></FlexBox>
    </ScreenTemplate>
  );
};

export default HealthGoalForm;

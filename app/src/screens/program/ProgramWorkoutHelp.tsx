import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import React from 'react';

const ProgramWorkoutHelp = () => {
  return (
    <ScreenTemplate
      isBackVisible
      headerTitleFormatted="Help"
      applyContentPadding>
      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to add another group?
        </PrimaryText>
        <PrimaryText>
          Tap on the circle plus icon in the navbar located at the top of the
          screen.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to add warm up sets?
        </PrimaryText>
        <PrimaryText>Tap the last set that the warm up will occur.</PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to delete sets?
        </PrimaryText>
        <PrimaryText>
          You can remove a set by tapping and holding on the set you want to
          remove.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to update the measurement for an exercise?
        </PrimaryText>
        <PrimaryText>
          Tap on the exercise and navigate to the exercise edit screen. There
          you will have an option to update the measurement type.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to remove/reorder exercises?
        </PrimaryText>
        <PrimaryText>
          Visit the menu and tap on the restructure option.
        </PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default ProgramWorkoutHelp;

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
          How to add another circuit?
        </PrimaryText>
        <PrimaryText>
          Press and hold on the plus icon and drag your finger to the icon with
          multiple dumbbells.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to add warm up sets?
        </PrimaryText>
        <PrimaryText>
          Press on the thermometer icon of the last set you want the warm up to
          end.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={10}>
        <PrimaryText marginBottom={5} bold>
          How to delete sets?
        </PrimaryText>
        <PrimaryText>Press on the trash bin icon.</PrimaryText>
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

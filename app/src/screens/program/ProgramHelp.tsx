import { PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import React from 'react';

const ProgramHelp = () => {
  return (
    <ScreenTemplate
      isBackVisible
      headerTitleFormatted="Help"
      applyContentPadding>
      <FlexBox column marginBottom={15}>
        <PrimaryText bold marginBottom={5}>
          How to upload a program image?
        </PrimaryText>
        <PrimaryText>
          You can add/update a program image by visiting the program menu and
          then edit program details.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={15}>
        <PrimaryText bold marginBottom={5}>
          How to generate the program into my workout calendar?
        </PrimaryText>
        <PrimaryText>
          You can generate a program by tapping on the download icon located on
          the top right. Select a date in which you would like to start the
          program. Then press create to generate and the program will appear on
          your workout calendar.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={15}>
        <PrimaryText bold marginBottom={5}>
          How to generate the program into my workout calendar?
        </PrimaryText>
        <PrimaryText>
          You can generate a program by tapping on the download icon located on
          the top right. Select a date in which you would like to start the
          program. Then press create to generate and the program will appear on
          your workout calendar.
        </PrimaryText>
      </FlexBox>

      <FlexBox column marginBottom={15}>
        <PrimaryText bold marginBottom={5}>
          How to copy and paste a workout?
        </PrimaryText>
        <PrimaryText>
          On the program home screen, press and hold on the workout you want to
          copy and then press and hold on the day you want to paste it.
        </PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default ProgramHelp;

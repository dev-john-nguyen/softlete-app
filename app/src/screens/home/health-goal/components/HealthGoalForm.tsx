import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import React, { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const HealthGoalForm = () => {
  const [sleep, setSleep] = useState(0);
  const [activeCalories, setActiveCalories] = useState(0);

  const onSave = () => {
    console.log(sleep, activeCalories);
  };

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      leftContentFlex={0}
      rightContentFlex={0}
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText size="large" variant="primary">
            Health Goals
          </PrimaryText>
        </FlexBox>
      }>
      <PrimaryText>
        Challenge yourself to reach your full potential by setting daily sleep
        and move goals.
      </PrimaryText>
      <FlexBox column marginTop={10}>
        <FlexBox
          paddingBottom={5}
          borderBottomWidth={1}
          borderBottomColor={Colors.white}
          marginBottom={5}>
          <PrimaryText variant="primary" size="medium">
            Sleep
          </PrimaryText>
        </FlexBox>
        <PrimaryText marginBottom={10}>
          {`It's recommended to sleep 7-9 hours per night.`}
        </PrimaryText>
        <Input
          label="Hours"
          onChangeText={numStr => setSleep(parseInt(numStr) ?? 0)}
          defaultValue={String(activeCalories)}
          keyboardType="numeric"
        />
      </FlexBox>
      <FlexBox column marginTop={10}>
        <FlexBox
          paddingBottom={5}
          borderBottomWidth={1}
          borderBottomColor={Colors.white}
          marginBottom={5}>
          <PrimaryText variant="primary" size="medium">
            Active Calories
          </PrimaryText>
        </FlexBox>
        <PrimaryText marginBottom={10}>
          {`We recommend you burn 200 active calories per day.`}
        </PrimaryText>
        <Input
          label="Kcal"
          onChangeText={numStr => setActiveCalories(parseInt(numStr) ?? 0)}
          defaultValue={String(sleep)}
          keyboardType="numeric"
        />
      </FlexBox>
      <PrimaryButton marginTop={30}>Save</PrimaryButton>
    </ScreenTemplate>
  );
};

export default HealthGoalForm;

import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import useBanner from 'src/hooks/utils/useBanner';
import { ReducerProps, ThunkAppDispatch } from 'src/services';
import { BannerTypes } from 'src/services/banner/types';
import { updateHealthGoalsAsync } from 'src/services/goals/slice';

const HealthGoalForm = () => {
  const [sleep, setSleep] = useState(0);
  const [activeCalories, setActiveCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const { sleep: sleepGlobal, activeCalories: activeCaloriesGlobal } =
    useSelector((state: ReducerProps) => ({
      sleep: state.goals.user.healths.sleep,
      activeCalories: state.goals.user.healths.activeCalories,
    }));
  const dispatch = useDispatch<ThunkAppDispatch>();
  const setBanner = useBanner();
  const navigation = useNavigation();

  const onSave = async () => {
    if (
      !sleep ||
      !activeCalories ||
      typeof sleep !== 'number' ||
      typeof activeCalories !== 'number'
    ) {
      return setBanner('Please enter a valid number.', BannerTypes.error);
    }
    if (
      sleep === sleepGlobal?.goal &&
      activeCalories === activeCaloriesGlobal?.goal
    ) {
      return setBanner('No changes were made to your health goals.');
    }

    if (sleep > 23) {
      return setBanner(
        'Please enter a valid sleep duration.',
        BannerTypes.error,
      );
    }
    setLoading(true);
    try {
      await dispatch(
        updateHealthGoalsAsync({ sleep, activeCalories }),
      ).unwrap();
      setBanner(
        'Your health goals have been successfully updated.',
        BannerTypes.success,
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      setBanner(
        "Oops! Sorry, couldn't save your goal. Please try again.",
        BannerTypes.error,
      );
    }
    setLoading(false);
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
          placeholder={String(sleepGlobal?.goal ?? 0)}
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
          placeholder={String(activeCaloriesGlobal?.goal ?? 0)}
          keyboardType="numeric"
        />
      </FlexBox>
      <PrimaryButton marginTop={30} onPress={onSave} loading={loading}>
        Save
      </PrimaryButton>
    </ScreenTemplate>
  );
};

export default HealthGoalForm;

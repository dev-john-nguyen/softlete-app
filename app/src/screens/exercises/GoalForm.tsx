import React, { useState } from 'react';
import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ExerciseProps } from 'src/services/exercises/types';
import { Colors, DateTools } from '@app/utils';
import { FlexBox } from '@app/ui';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { useDispatch } from 'react-redux';
import { addExerciseGoalAsync } from 'src/services/goals/slice';
import { ThunkAppDispatch } from 'src/services';
import { GoalStatus } from 'src/services/goals/types';

const GoalForm = () => {
  const dispatch = useDispatch<ThunkAppDispatch>();
  const [goalName, setGoalName] = useState<string>('');
  const [goalDescription, setGoalDescription] = useState<string>('');
  const [goalTarget, setGoalTarget] = useState<number>(0);
  const [goalStartDate, setGoalStartDate] = useState<Date>(new Date());
  const [goalEndDate, setGoalEndDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<string>('');
  const navigation = useNavigation();
  const route = useRoute<any>();
  const setBanner = useBanner();
  const { exercise } = route.params as { exercise: ExerciseProps };

  const validateGoal = () => {
    if (goalName.length === 0) {
      setBanner('Please enter a name for your goal.', BannerTypes.error);
      return false;
    } else if (goalName.length >= 200) {
      setBanner(
        'Goal name must be less than 200 characters long.',
        BannerTypes.error,
      );
      return false;
    }
    if (
      !goalTarget ||
      typeof goalTarget !== 'number' ||
      goalTarget <= 0 ||
      goalTarget > 99999999
    ) {
      setBanner('Please enter a valid goal target.', BannerTypes.error);
      return false;
    }

    if (goalDescription.length >= 500) {
      setBanner(
        'Goal description cannot exceed 500 characters.',
        BannerTypes.error,
      );
      return false;
    }
    if (goalStartDate.getTime() > goalEndDate.getTime()) {
      setBanner('Please enter a valid date range.', BannerTypes.error);
      return false;
    }
    return true;
  };

  const onCreateGoal = async () => {
    if (!exercise._id) {
      setBanner('Exercise ID is not defined', BannerTypes.error);
      navigation.goBack();
      return;
    }

    if (!validateGoal()) return;

    const newGoal = {
      name: goalName,
      description: goalDescription,
      goal: goalTarget,
      startDate: goalStartDate.toISOString(),
      endDate: goalEndDate.toISOString(),
      exerciseId: exercise._id as string,
      status: GoalStatus.pending,
    };

    try {
      await dispatch(addExerciseGoalAsync(newGoal)).unwrap();
      setBanner('Goal created successfully!', BannerTypes.success);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      setBanner('An error occurred.', BannerTypes.error);
    }
  };

  return (
    <ScreenTemplate
      applyKeyboardDismiss
      isDatePickerOpen={!!isDatePickerOpen}
      datePickerValue={
        isDatePickerOpen === 'goalStartDate' ? goalStartDate : goalEndDate
      }
      onDatePickerChange={date => {
        if (isDatePickerOpen === 'goalStartDate') {
          setGoalStartDate(date);
        } else {
          setGoalEndDate(date);
        }
      }}
      onDatePickerClose={() => setIsDatePickerOpen('')}
      isBackVisible
      applyContentPadding
      leftContentFlex={0}
      rightContentFlex={0}
      middleContentFlex={1}
      middleContent={
        <FlexBox flex={1} marginLeft={10}>
          <PrimaryText
            size="large"
            variant="primary"
            textTransform="capitalize">
            {exercise.name}
          </PrimaryText>
        </FlexBox>
      }>
      <PrimaryText marginBottom={10}>
        Create a new goal to challenge yourself.
      </PrimaryText>
      <Input
        label="Name"
        placeholder="Enter a name for your goal"
        onChangeText={value => setGoalName(value)}
        mb={5}
      />
      <Input
        label="Target"
        placeholder="Enter your target goal"
        keyboardType="numeric"
        onChangeText={value => setGoalTarget(parseInt(value) ?? 0)}
        mb={5}
      />
      <Input
        label="Description"
        placeholder="Enter a brief description"
        onChangeText={value => setGoalDescription(value)}
        mb={5}
        multiline
      />
      <FlexBox column marginTop={5}>
        <PrimaryText marginBottom={5}>Range</PrimaryText>
        <FlexBox alignItems="center">
          <PrimaryButton
            onPress={() => {
              setIsDatePickerOpen('goalStartDate');
            }}>
            {DateTools.dateToStr(goalStartDate)}
          </PrimaryButton>
          <FlexBox
            marginLeft={10}
            marginRight={10}
            width={10}
            height={1}
            backgroundColor={Colors.white}
          />
          <PrimaryButton
            onPress={() => {
              setIsDatePickerOpen('goalEndDate');
            }}>
            {DateTools.dateToStr(goalEndDate)}
          </PrimaryButton>
        </FlexBox>
      </FlexBox>
      <PrimaryButton onPress={onCreateGoal} marginTop={20}>
        Create
      </PrimaryButton>
    </ScreenTemplate>
  );
};

export default GoalForm;

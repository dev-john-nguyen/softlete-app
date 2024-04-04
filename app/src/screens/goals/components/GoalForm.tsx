import React, { useEffect, useMemo, useState } from 'react';
import {
  Input,
  PickerButton,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ExerciseProps } from 'src/types/exercises.types';
import { Colors, DateTools } from '@app/utils';
import { FlexBox } from '@app/ui';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import { useDispatch } from 'react-redux';
import { upsertExerciseGoalAsync } from 'src/services/goals/slice';
import { ThunkAppDispatch } from 'src/services';
import {
  GoalInitProps,
  GoalMeasurements,
  GoalSubTypes,
  GoalSubTypesLabels,
  GoalTypes,
} from 'src/services/goals/types';
import { HomeStackParamsList } from '../../home/types';
import { PickerOptionProp } from 'src/components/elements/Picker';

const GoalForm = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dispatch = useDispatch<ThunkAppDispatch>();
  const [goalName, setGoalName] = useState<string>('');
  const [goalDescription, setGoalDescription] = useState<string>('');
  const [goalTarget, setGoalTarget] = useState<number>(0);
  const [goalStartDate, setGoalStartDate] = useState<Date>(today);
  const [goalEndDate, setGoalEndDate] = useState<Date>(tomorrow);
  const [goalSubType, setGoalSubType] = useState<GoalSubTypes>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<string>('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [exercise, setExercise] = useState<ExerciseProps>();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamsList, 'GoalFormModal'>>();
  const setBanner = useBanner();

  useEffect(() => {
    if (route.params.type === GoalTypes.exercise) {
      if (route.params && route.params.exercise) {
        setExercise(route.params.exercise);
      } else {
        setBanner('There was not exercise data provided.', BannerTypes.error);
        navigation.goBack();
      }
    }

    if (route.params.goal) {
      const { goal } = route.params;
      setGoalName(goal.name);
      setGoalDescription(goal.description ?? '');
      setGoalTarget(goal.goal);
      setGoalStartDate(new Date(goal.startDate));
      setGoalEndDate(new Date(goal.endDate));
      setGoalSubType(goal.subType);
    }
  }, [route]);

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
    if (
      DateTools.isSameDate(goalStartDate, goalEndDate) ||
      goalStartDate.getTime() > goalEndDate.getTime()
    ) {
      setBanner('Please enter a valid date range.', BannerTypes.error);
      return false;
    }

    if (route.params.type === GoalTypes.endurance && !goalSubType) {
      setBanner(
        'Please select the type of goal you want to track.',
        BannerTypes.error,
      );
      return false;
    }

    return true;
  };

  const getMeasurement = () => {
    switch (goalSubType) {
      case GoalSubTypes.endurance_distance:
        return GoalMeasurements.mi;
      case GoalSubTypes.endurance_duration:
        return GoalMeasurements.min;
      case GoalSubTypes.endurance_avg_pace:
        return GoalMeasurements.mins_per_mi;
    }
    return GoalMeasurements.mi;
  };

  const onCreateGoal = async () => {
    if (
      route.params.type === GoalTypes.exercise &&
      (!exercise || !exercise._id)
    ) {
      setBanner('Exercise ID is not defined', BannerTypes.error);
      navigation.goBack();
      return;
    }

    if (!validateGoal()) return;

    const newGoal: GoalInitProps = {
      name: goalName,
      description: goalDescription,
      goal: goalTarget,
      startDate: goalStartDate.toISOString(),
      endDate: goalEndDate.toISOString(),
      exerciseUid:
        route.params.type === GoalTypes.exercise ? exercise?._id : undefined,
      type: route.params.type,
    };

    if (route.params.type === GoalTypes.endurance) {
      newGoal.subType = goalSubType;
      newGoal.measurement = getMeasurement();
    }

    // update goal if route params has goal
    if (route.params.goal && route.params.goal._id) {
      newGoal._id = route.params.goal._id;
    }

    try {
      await dispatch(upsertExerciseGoalAsync(newGoal)).unwrap();
      setBanner('Goal created successfully!', BannerTypes.success);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      setBanner('An error occurred.', BannerTypes.error);
    }
  };

  const pickerOptions = useMemo(() => {
    const options = Object.values(GoalSubTypesLabels).map(
      ({ value, label }) => {
        return {
          value,
          label,
        } as PickerOptionProp;
      },
    );
    options.unshift({ value: '', label: '' });
    return options;
  }, []);

  const goalSubTypeValueLabel = goalSubType
    ? GoalSubTypesLabels[goalSubType]?.label
    : undefined;

  return (
    <ScreenTemplate
      applyKeyboardDismiss
      pickerValue={goalSubType}
      isPickerOpen={isPickerOpen}
      pickerOptions={pickerOptions}
      onPickerChangeValue={value => setGoalSubType(value as GoalSubTypes)}
      onPickerClose={() => setIsPickerOpen(false)}
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
            {route.params.type === GoalTypes.exercise
              ? exercise?.name
              : 'Endurance'}
          </PrimaryText>
        </FlexBox>
      }>
      <PrimaryText marginBottom={10}>
        {`"Setting goals is the first step in turning the invisible into the visible." - Tony Robbins`}
      </PrimaryText>
      <Input
        label="Name"
        placeholder="Enter a name for your goal"
        onChangeText={value => setGoalName(value)}
        defaultValue={goalName}
        mb={5}
      />
      <Input
        label="Target"
        placeholder="Enter your target goal"
        keyboardType="numeric"
        onChangeText={value => setGoalTarget(parseInt(value) ?? 0)}
        defaultValue={isNaN(Number(goalTarget)) ? '' : goalTarget.toString()}
        mb={5}
      />
      <Input
        label="Description"
        placeholder="Enter a brief description"
        onChangeText={value => setGoalDescription(value)}
        defaultValue={goalDescription}
        mb={5}
        multiline
      />
      {route.params.type === GoalTypes.endurance && (
        <PickerButton
          arrow
          arrowDirection="down"
          label="Type"
          textTransform="capitalize"
          valueOpacity={goalSubTypeValueLabel ? 1 : 0.2}
          onPress={() => setIsPickerOpen(true)}
          marginBottom={5}>
          {goalSubTypeValueLabel || 'Select Goal Type'}
        </PickerButton>
      )}
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
        Submit
      </PrimaryButton>
    </ScreenTemplate>
  );
};

export default GoalForm;

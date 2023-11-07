import React from 'react';
import Icon from '@app/icons';
import { Colors, rgba } from '@app/utils';
import { FlexBox } from '@app/ui';
import { ExerciseProps } from '../../../../services/exercises/types';
import { AnalyticsProps } from '../../../../services/misc/types';
import WoExerciseChart from '../../../../components/home/components/WoExerciseChart';
import { HomeStackParamsList, HomeStackScreens } from '../../types';
import SectionHeader from '../../../../components/home/components/SectionHeader';
import { useNavigation } from '@react-navigation/native';
import PrimaryText from '../../../../components/elements/PrimaryText';
import { StackNavigationProp } from '@react-navigation/stack';
import { DemoArrow } from '@app/elements';
import { DemoStates } from '@app/services';

interface Props {
  pinAnalytics: AnalyticsProps[];
  setPicker: React.Dispatch<React.SetStateAction<string | undefined>>;
  chartFilter: string;
  selectedEx?: ExerciseProps;
}

const HomeExercises = ({
  pinAnalytics,
  setPicker,
  chartFilter,
  selectedEx,
}: Props) => {
  const { navigate } =
    useNavigation<StackNavigationProp<HomeStackParamsList>>();

  const onNavigateToSearchExercises = () =>
    navigate(HomeStackScreens.SearchExercises);

  const onNavToExercise = () =>
    selectedEx && navigate(HomeStackScreens.Exercise, { exercise: selectedEx });

  const onNavToEnduranceAnalytics = () =>
    navigate(HomeStackScreens.EnduranceAnalytics);

  return (
    <FlexBox column screenWidth>
      <FlexBox column paddingLeft={20} paddingRight={20}>
        <SectionHeader
          title="Exercises"
          desc="Identify your previous exercise performances. Pin exercises to quickly view them below."
          RightElement={
            <FlexBox>
              <DemoArrow
                state={[
                  DemoStates.EXERCISE_HOME_EXERCISE_LIST,
                  DemoStates.EXERCISE_HOME_ENDURANCE,
                ]}
              />
              <Icon
                icon="cardio"
                size={20}
                color={Colors.white}
                onPress={onNavToEnduranceAnalytics}
                hitSlop={10}
                containerStyles={{ marginRight: 10 }}
              />
              <Icon
                icon="kettlebell"
                size={20}
                color={Colors.white}
                onPress={onNavigateToSearchExercises}
                hitSlop={10}
              />
            </FlexBox>
          }
        />
        <DemoArrow state={[DemoStates.EXERCISE_HOME_PINNED]} />
        <FlexBox
          alignItems="center"
          justifyContent="space-between"
          marginTop={20}>
          <FlexBox
            onPress={() => setPicker('exercise')}
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            paddingLeft={15}
            paddingRight={15}
            padding={5}
            borderRadius={5}
            alignSelf="flex-start"
            borderColor={rgba(Colors.whiteRbg, 0.1)}>
            {selectedEx ? (
              <PrimaryText
                size="small"
                numberOfLines={1}
                textTransform="capitalize">
                {selectedEx.name}
              </PrimaryText>
            ) : (
              <PrimaryText size="small" color={rgba(Colors.whiteRbg, 0.5)}>
                Choose an exercise
              </PrimaryText>
            )}
          </FlexBox>
          <FlexBox
            padding={6}
            borderWidth={1}
            borderRadius={100}
            borderColor={Colors.white}
            alignItems="center"
            justifyContent="center"
            opacity={selectedEx ? 1 : 0.2}
            onPress={onNavToExercise}>
            <Icon
              size={10}
              strokeColor={Colors.white}
              direction="right"
              icon="chevron"
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
      <WoExerciseChart
        analytics={pinAnalytics}
        selectedEx={selectedEx}
        chartFilter={chartFilter}
        setPicker={setPicker}
      />
    </FlexBox>
  );
};

export default HomeExercises;

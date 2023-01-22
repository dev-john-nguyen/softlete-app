import React from 'react';
import Icon from '@app/icons';
import { Colors, rgba } from '@app/utils';
import { FlexBox } from '@app/ui';
import { ExerciseProps } from '../../services/exercises/types';
import { AnalyticsProps } from '../../services/misc/types';
import WoExerciseChart from './components/WoExerciseChart';
import {
  HomeStackParamsList,
  HomeStackScreens,
} from '../../screens/home/types';
import SectionHeader from './components/SectionHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import PrimaryText from '../elements/PrimaryText';

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
  const { navigate } = useNavigation<NavigationProp<HomeStackParamsList>>();

  const onNavigateToSearchExercises = () =>
    navigate(HomeStackScreens.SearchExercises);

  const onNavToExercise = () =>
    selectedEx && navigate(HomeStackScreens.Exercise, { exercise: selectedEx });

  return (
    <FlexBox column screenWidth paddingLeft={20} paddingRight={20}>
      <SectionHeader
        title="Exercises"
        desc="Pin multiple exercises and quickly access your previous performances."
        RightElement={
          <FlexBox>
            <Icon
              icon="dumb_bell"
              size={20}
              color={Colors.white}
              onPress={onNavigateToSearchExercises}
              hitSlop={10}
            />
          </FlexBox>
        }
      />
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
          onPress={onNavToExercise}>
          <Icon
            size={10}
            strokeColor={Colors.white}
            direction="right"
            icon="chevron"
            opacity={selectedEx ? 1 : 0.5}
          />
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

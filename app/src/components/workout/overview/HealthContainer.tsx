import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { HomeStackScreens } from '../../../screens/home/types';
import { HealthDataProps, WorkoutProps } from '../../../services/workout/types';
import { InfoListBox } from '@app/elements';
import {
  Colors,
  convertTimeToFormatTime,
  renderCalories,
  renderDistance,
  renderHealthActivityName,
  renderHeartRateAvg,
} from '@app/utils';
import useBanner from 'src/hooks/utils/useBanner';

interface Props {
  data?: HealthDataProps;
  workout?: WorkoutProps;
}

const HealthContainer = ({ data, workout }: Props) => {
  const navigation = useNavigation<any>();
  const setBanner = useBanner();

  const onMapPress = () =>
    data
      ? navigation.navigate(HomeStackScreens.Map, { data })
      : setBanner('No health data found for this workout.');

  const onViewSummary = () =>
    data
      ? navigation.navigate(HomeStackScreens.WorkoutActivitySummary, { data })
      : setBanner('No health data found for this workout.');

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'flex-start' }}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <InfoListBox
        secondary
        icon="category"
        label="Activity"
        desc={
          data
            ? renderHealthActivityName(data.activityName)
            : workout
            ? renderHealthActivityName(workout.type)
            : 'Activity'
        }
      />
      <InfoListBox
        secondary
        icon="devices"
        label="Source"
        desc={data ? data.sourceName : 'Manual'}
      />

      <InfoListBox
        secondary
        icon="clock"
        label="Duration"
        desc={
          data
            ? (convertTimeToFormatTime(
                data.duration,
                undefined,
                'sec',
              ) as string)
            : '0 sec'
        }
      />

      <InfoListBox
        secondary
        icon="ruler"
        label="Distance"
        desc={`${data ? renderDistance(data.distance) : 0} ${
          data?.disMeas ? data.disMeas : 'mi'
        }`}
      />

      <InfoListBox
        secondary
        icon="fire"
        label="Calories"
        desc={data ? renderCalories(data.calories) : '0 kcal'}
      />

      <InfoListBox
        secondary
        icon="heart"
        label="Avg HR"
        desc={`${renderHeartRateAvg(data?.heartRates)} bpm`}
      />

      <InfoListBox
        secondary
        label="View"
        icon="notebook"
        desc="Statistics"
        onPress={onViewSummary}
        color={Colors.white}
        opacity={data ? 1 : 0.5}
      />

      <InfoListBox
        secondary
        icon="compass"
        label="View"
        desc="Map Visual"
        onPress={onMapPress}
        opacity={data ? 1 : 0.5}
      />
    </ScrollView>
  );
};

export default HealthContainer;

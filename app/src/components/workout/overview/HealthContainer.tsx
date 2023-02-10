import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { HomeStackScreens } from '../../../screens/home/types';
import { HealthDataProps } from '../../../services/workout/types';
import {
  convertMsToTime,
  renderCalories,
  renderDistance,
  renderHealthActivityName,
  renderHeartRateAvg,
} from '../../../utils/format';
import { InfoListBox } from '@app/elements';
import { Colors } from '@app/utils';

interface Props {
  data?: HealthDataProps;
}

const HealthContainer = ({ data }: Props) => {
  const navigation = useNavigation<any>();

  const onMapPress = () => navigation.navigate(HomeStackScreens.Map, { data });

  const onViewSummary = () =>
    navigation.navigate(HomeStackScreens.WorkoutActivitySummary, { data });

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
        desc={data ? renderHealthActivityName(data.activityName) : 'Activity'}
      />
      <InfoListBox
        secondary
        icon="devices"
        label="Source"
        desc={data ? data.sourceName : 'unknown'}
      />

      <InfoListBox
        secondary
        icon="clock"
        label="Duration"
        desc={data ? (convertMsToTime(data.duration) as string) : '0 sec'}
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
      />

      <InfoListBox
        secondary
        icon="compass"
        label="View"
        desc="Map Visual"
        onPress={onMapPress}
      />
    </ScrollView>
  );
};

export default HealthContainer;

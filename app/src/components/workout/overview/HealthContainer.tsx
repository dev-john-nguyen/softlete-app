import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { HomeStackScreens } from '../../../screens/home/types';
import { HealthDataProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import { renderHealthActivityName } from '../../../utils/format';
import { normalize } from '../../../utils/tools';
import StyleConstants from '../../tools/StyleConstants';
import HeartRateChart from './HeartRateChart';
import {
  convertMsToTime,
  renderCalories,
  renderDistance,
  renderHeartRateAvg,
} from '../../../utils/format';
import { InfoListBox } from '@app/elements';

interface Props {
  data?: HealthDataProps;
}

const HealthContainer = ({ data }: Props) => {
  const [showGraph, setShowGraph] = useState(false);
  const navigation = useNavigation<any>();

  if (showGraph) {
    return (
      <HeartRateChart
        data={data && data.heartRates ? data.heartRates : []}
        onClose={() => setShowGraph(false)}
        color={BaseColors.white}
      />
    );
  }

  const onMapPress = () => navigation.navigate(HomeStackScreens.Map, { data });

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
        onPress={() => setShowGraph(true)}
      />

      <InfoListBox
        secondary
        icon="compass"
        label="View Map"
        desc={`${data ? renderDistance(data.distance) : 0} ${
          data?.disMeas ? data.disMeas : 'mi'
        }`}
        onPress={onMapPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    marginTop: StyleConstants.baseMargin,
    backgroundColor: BaseColors.white,
    padding: StyleConstants.baseMargin,
    borderRadius: StyleConstants.borderRadius,
    marginRight: StyleConstants.baseMargin,
    shadowColor: BaseColors.lightPrimary,
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  svg: {
    width: normalize.width(15),
    height: normalize.width(15),
    marginBottom: StyleConstants.smallMargin,
  },
  label: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.secondary,
    marginRight: StyleConstants.smallMargin,
    marginBottom: StyleConstants.smallMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.primary,
    paddingTop: StyleConstants.baseMargin,
  },
});
export default HealthContainer;

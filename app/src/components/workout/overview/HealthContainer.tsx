import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CategorySvg from '../../../assets/CategorySvg';
import ClockSvg from '../../../assets/ClockSvg';
import CompassSvg from '../../../assets/CompassSvg';
import DevicesSvg from '../../../assets/DevicesSvg';
import FireSvg from '../../../assets/FireSvg';
import GraphSvg from '../../../assets/GraphSvg';
import HeartSvg from '../../../assets/HeartSvg';
import RulerSvg from '../../../assets/RulerSvg';
import { HomeStackScreens } from '../../../screens/home/types';
import { HealthDataProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import { renderHealthActivityName } from '../../../utils/format';
import { normalize } from '../../../utils/tools';
import StyleConstants from '../../tools/StyleConstants';
import HealthItem from './HealthItem';
import HeartRateChart from './HeartRateChart';
import {
  convertMsToTime,
  renderCalories,
  renderDistance,
  renderHeartRateAvg,
} from '../../../utils/format';

interface Props {
  data?: HealthDataProps;
  status: string;
}

const HealthContainer = ({ data, status }: Props) => {
  const [showGraph, setShowGraph] = useState(false);
  const navigation = useNavigation<any>();

  if (showGraph) {
    return (
      <HeartRateChart
        data={data && data.heartRates ? data.heartRates : []}
        onBack={() => setShowGraph(false)}
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
      <HealthItem
        svg={<CategorySvg fillColor={BaseColors.white} />}
        label="Activity"
        text={data ? renderHealthActivityName(data.activityName) : 'Activity'}
      />
      <HealthItem
        svg={<DevicesSvg fillColor={BaseColors.white} />}
        label="Source"
        text={data ? data.sourceName : 'unknown'}
      />
      <HealthItem
        svg={<ClockSvg fillColor={BaseColors.white} />}
        label="Duration"
        text={data ? convertMsToTime(data.duration) : '0 sec'}
      />
      <HealthItem
        svg={<RulerSvg fillColor={BaseColors.white} />}
        label="Distance"
        text={`${data ? renderDistance(data.distance) : 0} ${
          data?.disMeas ? data.disMeas : 'mi'
        }`}
      />
      <HealthItem
        svg={<HeartSvg fillColor={BaseColors.white} />}
        topRight={<GraphSvg color={BaseColors.white} />}
        label="Avg HR"
        text={`${renderHeartRateAvg(data?.heartRates)} bpm`}
        onPress={() => setShowGraph(true)}
      />
      <HealthItem
        svg={<FireSvg fillColor={BaseColors.white} />}
        label="Calories"
        text={data ? renderCalories(data.calories) : '0 kcal'}
      />
      <HealthItem
        svg={<CompassSvg color={BaseColors.white} />}
        label="View Map"
        text={''}
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

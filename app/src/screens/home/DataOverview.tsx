import { Picker } from '@react-native-picker/picker';
import _, { capitalize } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Chevron from '../../assets/ChevronSvg';
import DataOverviewItem from '../../components/data-overview/Item';
import {
  DataProps,
  GroupedProps,
  Stats,
} from '../../components/data-overview/types';
import CustomPicker from '../../components/elements/Picker';
import SecondaryText from '../../components/elements/SecondaryText';
import StyleConstants from '../../components/tools/StyleConstants';
import { ReducerProps } from '../../services';
import { HealthDataProps } from '../../services/workout/types';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';

/* 
    This screen provides a general overview of exercise health related data
*/

interface Props {
  healthData: HealthDataProps[];
}

const DataOverview = ({ healthData }: Props) => {
  const [data, setData] = useState<DataProps[]>([]);
  const [filter, setFilter] = useState(Stats.calories);
  const [picker, setPicker] = useState(false);

  const formatHealthData = useCallback(() => {
    //group health data by activity name
    const grouped: GroupedProps = _.reduce(
      healthData,
      (result, value) => {
        const name = value.activityName;
        if (result[name]) {
          result[name].push(value);
        } else {
          result[name] = [value];
        }
        return result;
      },
      {} as GroupedProps,
    );

    const dataStore: DataProps[] = [];

    for (const key in grouped) {
      if (grouped.hasOwnProperty(key)) {
        const healthData = grouped[key];

        //sort by dates
        healthData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        const disVals = healthData.map(d => d.distance);
        const durVals = healthData.map(d => d.duration);
        const calVals = healthData.map(d => d.calories);
        const dates = healthData.map(d => d.date);

        dataStore.push({
          activityName: key,
          calories: calVals,
          distance: disVals,
          duration: durVals,
          dates: dates,
          data: healthData,
        });
      }
    }

    setData(dataStore);
  }, [healthData]);

  useEffect(() => {
    formatHealthData();
  }, [healthData]);

  const renderItem = useCallback(
    ({ item }: { item: DataProps }) => {
      return <DataOverviewItem data={item} filter={filter} />;
    },
    [data, filter],
  );

  const renderPickerItems = () => {
    return Object.values(Stats).map(item => (
      <Picker.Item label={capitalize(item)} value={item} key={item} />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => setPicker(true)}
          style={styles.filterContainer}>
          <SecondaryText styles={styles.filterText} bold>
            {capitalize(filter)}
          </SecondaryText>
          <View style={styles.chev}>
            <Chevron strokeColor={BaseColors.lightBlack} />
          </View>
        </Pressable>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.activityName ? item.activityName : index.toString()
        }
      />

      <CustomPicker
        pickerItems={renderPickerItems()}
        value={filter}
        setValue={val => setFilter(val as Stats)}
        open={picker}
        setOpen={a => setPicker(a)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterLabel: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.black,
    marginBottom: 5,
  },
  headerContainer: {
    margin: StyleConstants.baseMargin,
  },
  filterContainer: {
    backgroundColor: BaseColors.white,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chev: {
    width: normalize.width(30),
    height: normalize.width(30),
    transform: [{ rotate: '-90deg' }],
  },
  filterText: {
    fontSize: StyleConstants.smallFont,
    color: BaseColors.lightBlack,
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  healthData: state.workout.healthData,
});

export default connect(mapStateToProps)(DataOverview);

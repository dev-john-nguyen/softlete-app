import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HealthDataProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import PrimaryButton from '../../elements/PrimaryButton';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants from '../../tools/StyleConstants';
import DisplayHealthData from './HealthContainer';
import { renderTime } from '../../../utils/format';

interface Props {
  onImportData: () => void;
  data: HealthDataProps;
}

const ImportItem = ({ data, onImportData }: Props) => {
  const renderData = () => {
    return {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      activityId: data.activityId,
      heartRates: data.heartRates,
    } as HealthDataProps;
  };

  const renderDate = () => {
    if (data.start && data.end) {
      return 'Time: ' + renderTime(data.start) + ' - ' + renderTime(data.end);
    }
    return 'Custom';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <PrimaryButton onPress={onImportData} styles={styles.import}>
          Import
        </PrimaryButton>
        <SecondaryText styles={styles.time} bold>
          {renderDate()}
        </SecondaryText>
      </View>
      <DisplayHealthData data={renderData()} status={''} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: StyleConstants.baseMargin,
  },
  import: {
    alignSelf: 'flex-start',
    fontSize: StyleConstants.extraSmallFont,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.secondary,
  },
});
export default ImportItem;

/* eslint-disable no-case-declarations */
import { PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import _, { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import { ExerciseProps } from '../../../services/exercises/types';
import { AnalyticsProps } from '../../../services/misc/types';
import BaseColors, { rgba } from '../../../utils/BaseColors';
import DateTools from '../../../utils/DateTools';
import ExerciseChart from './ExerciseChart';

interface Props {
  analytics: AnalyticsProps[];
  selectedEx?: ExerciseProps;
  chartFilter: string;
  setPicker: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WoExerciseChart = ({
  analytics,
  selectedEx,
  chartFilter,
  setPicker,
}: Props) => {
  const data = useMemo(() => {
    //populate data with all of the performed values for the selectedEx
    if (!selectedEx) return [];

    const targetAnalytics = analytics.find(
      a => a.exerciseUid === selectedEx?._id,
    );

    if (!targetAnalytics) return [];

    const numStore: {
      date: Date;
      value: number;
    }[] = [];

    const sortedData = targetAnalytics.data.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sortedData.forEach(item => {
      const dataStore: number[] = [];

      item.data.forEach(d => {
        if (d.performVal && !d.warmup) dataStore.push(d.performVal);
      });

      //if there are no valid data
      if (dataStore.length < 1) return;

      //calc avg
      let num = 0;

      switch (chartFilter) {
        case 'min':
          const min = _.min(dataStore);
          num = min ? _.round(min) : 0;
          break;
        case 'max':
          const max = _.max(dataStore);
          num = max ? _.round(max) : 0;
          break;
        case 'avg':
        default:
          const mean = _.mean(dataStore);
          num = mean ? _.round(mean) : 0;
      }

      //format date
      const d = DateTools.UTCISOToLocalDate(item.date);

      numStore.push({
        date: d,
        value: num,
      });
    });

    return numStore;
  }, [analytics, chartFilter, selectedEx]);

  const label =
    selectedEx && selectedEx.measSubCat
      ? capitalize(selectedEx.measSubCat)
      : 'N/A';

  return (
    <FlexBox marginTop={10} column>
      <FlexBox
        marginBottom={10}
        alignItems="center"
        justifyContent="space-between">
        <FlexBox
          onPress={() => setPicker('chartFilter')}
          alignSelf="flex-start"
          borderWidth={1}
          paddingLeft={20}
          paddingRight={20}
          padding={5}
          borderRadius={5}
          borderColor={rgba(BaseColors.whiteRbg, 0.1)}
          hitSlop={10}>
          <PrimaryText size="small" textTransform="capitalize">
            {chartFilter}
          </PrimaryText>
        </FlexBox>
        <FlexBox alignItems="center">
          <Icon icon="ruler" size={20} color={Colors.white} />
          <PrimaryText size="small" marginLeft={5}>
            {label}
          </PrimaryText>
        </FlexBox>
      </FlexBox>
      <ExerciseChart data={data} />
    </FlexBox>
  );
};

export default WoExerciseChart;

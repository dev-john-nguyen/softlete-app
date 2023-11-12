import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AnalyticalDataProps } from '../../services/misc/types';
import BaseColors, { rgba } from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import Empty from './Empty';
import {
  HealthDataProps,
  WorkoutExerciseDataProps,
} from 'src/services/workout/types';
import WorkoutTracker from 'src/classes/WorkoutTracker';
import { DataType } from './types';

interface Props {
  data: AnalyticalDataProps<unknown>[];
  type?: DataType;
}

const { strToDate } = DateTools;

const renderDate = (d: string) => {
  const date = strToDate(d);
  return date.getMonth() + 1 + '/' + date.getDate();
};

const DataTable = ({ data, type = DataType.workout }: Props) => {
  const renderVisual = useMemo(() => {
    if (type === DataType.workout) {
      let count = 0;
      return (data as AnalyticalDataProps<WorkoutExerciseDataProps[]>[])
        .sort((a, b) => {
          const dateA = strToDate(a.date);
          const dateB = strToDate(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .map(d => {
          return (
            <View key={d.workoutExerciseUid}>
              {d.data.map(({ performVal, reps, _id }, i) => {
                count++;
                return (
                  <FlexBox
                    key={_id || i}
                    backgroundColor={
                      count % 2 === 0
                        ? rgba(BaseColors.whiteRbg, 0.05)
                        : 'transparent'
                    }
                    justifyContent="space-between"
                    marginBottom={5}
                    padding={10}>
                    <PrimaryText flex={0.5}>{renderDate(d.date)}</PrimaryText>
                    <PrimaryText flex={0.5}>{i + 1}</PrimaryText>
                    <PrimaryText flex={0.5}>{reps}</PrimaryText>
                    <PrimaryText flex={1}>{performVal}</PrimaryText>
                  </FlexBox>
                );
              })}
            </View>
          );
        });
    } else {
      return (data as AnalyticalDataProps<HealthDataProps>[]).map((d, i) => {
        const healthWorkout = new WorkoutTracker();
        healthWorkout.initializeHealthData(d.data);
        const formatted = healthWorkout.getFormattedData();
        return (
          <FlexBox
            key={d.workoutExerciseUid || i}
            backgroundColor={
              i % 2 === 0 ? rgba(BaseColors.whiteRbg, 0.05) : 'transparent'
            }
            justifyContent="space-between"
            marginBottom={5}
            padding={10}>
            <PrimaryText flex={0.6}>
              {healthWorkout.getDate(undefined, undefined, false)}
            </PrimaryText>
            <PrimaryText flex={1}>{formatted?.duration}</PrimaryText>
            <PrimaryText flex={0.8}>{formatted?.distance}</PrimaryText>
            <PrimaryText flex={0.8}>{healthWorkout.averagePace}</PrimaryText>
          </FlexBox>
        );
      });
    }
  }, [data, type]);

  const renderHeader = useMemo(() => {
    if (type === DataType.workout) {
      return (
        <FlexBox
          padding={10}
          paddingBottom={15}
          justifyContent="space-between"
          opacity={0.8}
          backgroundColor={Colors.lightPrimary}>
          <PrimaryText flex={0.5}>Date</PrimaryText>
          <PrimaryText flex={0.5}>Set</PrimaryText>
          <PrimaryText flex={0.5}>Rep</PrimaryText>
          <PrimaryText flex={1}>Weight</PrimaryText>
        </FlexBox>
      );
    } else {
      return (
        <FlexBox
          padding={10}
          paddingBottom={15}
          justifyContent="space-between"
          opacity={0.8}
          backgroundColor={Colors.lightPrimary}>
          <PrimaryText flex={0.6}>Date</PrimaryText>
          <PrimaryText flex={1}>Duration</PrimaryText>
          <PrimaryText flex={0.8}>Distance</PrimaryText>
          <PrimaryText flex={0.8}>{`Pace / Mi`}</PrimaryText>
        </FlexBox>
      );
    }
  }, [type]);

  return (
    <FlexBox column flex={1} paddingLeft={15} paddingRight={15}>
      {renderHeader}
      {data.length > 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {renderVisual}
        </ScrollView>
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default DataTable;

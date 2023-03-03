import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AnalyticsProps } from '../../services/misc/types';
import BaseColors, { rgba } from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import Empty from './Empty';

interface Props {
  data: AnalyticsProps['data'];
}

const { strToDate } = DateTools;

const renderDate = (d: string) => {
  const date = strToDate(d);
  return date.getMonth() + 1 + '/' + date.getDate();
};

const DataTable = ({ data }: Props) => {
  return (
    <FlexBox column flex={1} paddingLeft={15} paddingRight={15}>
      <FlexBox
        padding={10}
        paddingBottom={15}
        justifyContent="space-between"
        opacity={0.8}
        backgroundColor={Colors.blendWhite}>
        <PrimaryText flex={0.5}>Date</PrimaryText>
        <PrimaryText flex={0.5}>Set</PrimaryText>
        <PrimaryText flex={0.5}>Rep</PrimaryText>
        <PrimaryText flex={1}>Weight</PrimaryText>
      </FlexBox>
      {data.length > 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {data.map((d, i) => (
            <View key={d.workoutExerciseUid}>
              {d.data.map(({ performVal, reps, _id }, i) => (
                <FlexBox
                  key={_id || i}
                  backgroundColor={
                    i % 2 === 0 ? rgba(BaseColors.whiteRbg, 0.2) : 'transparent'
                  }
                  justifyContent="space-between"
                  marginBottom={5}
                  padding={10}>
                  <PrimaryText flex={0.5}>{renderDate(d.date)}</PrimaryText>
                  <PrimaryText flex={0.5}>{i + 1}</PrimaryText>
                  <PrimaryText flex={0.5}>{reps}</PrimaryText>
                  <PrimaryText flex={1}>{performVal}</PrimaryText>
                </FlexBox>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default DataTable;

import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';
import Empty from './Empty';
import { AnalyticDataProps } from './types';

type GroupedChartProps = {
  data: AnalyticDataProps;
  largestNum: number;
};

const colors = {
  avg: rgba(Colors.whiteRbg, 0.4),
  min: rgba(Colors.whiteRbg, 0.2),
  max: rgba(Colors.whiteRbg, 0.6),
};

const GroupedChart = ({ data, largestNum }: GroupedChartProps) => {
  const width = useMemo(() => {
    const getWidth = (num: number) => {
      const r = Math.round((num / largestNum) * 100);
      return r;
    };
    return {
      min: getWidth(data.min),
      avg: getWidth(data.avg),
      max: getWidth(data.max),
    };
  }, [data, largestNum]);

  const viewStyles = useCallback((num: number, color: string) => {
    return {
      width: `${num}%`,
      height: 15,
      backgroundColor: color,
      positon: 'relative',
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      justifyContent: 'center',
    } as StyleProp<ViewStyle>;
  }, []);

  return (
    <FlexBox>
      <FlexBox column width="85%" positon="relative" marginRight={5}>
        <View style={viewStyles(width.min, colors.min)} />
        <View style={viewStyles(width.avg, colors.avg)} />
        <View style={viewStyles(width.max, colors.max)} />
      </FlexBox>
      <FlexBox column alignItems="flex-end">
        <FlexBox height={15}>
          <PrimaryText>{data.min}</PrimaryText>
        </FlexBox>
        <FlexBox height={15}>
          <PrimaryText>{data.avg}</PrimaryText>
        </FlexBox>
        <FlexBox height={15}>
          <PrimaryText>{data.max}</PrimaryText>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

type StackedBarChartProps = {
  data: AnalyticDataProps[];
};

const StackedBarChart = ({ data }: StackedBarChartProps) => {
  const largestNum = useMemo(() => {
    let largest = 0;
    data.forEach(stats => {
      if (stats.max > largest) {
        largest = stats.max;
      }
    });
    return largest;
  }, [data]);

  return (
    <FlexBox column flex={1} padding={15}>
      {data.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              {data.map(({ date }) => (
                <View
                  style={{
                    height: 3 * 15,
                    marginBottom: StyleConstants.smallMargin,
                    marginTop: StyleConstants.smallMargin,
                    justifyContent: 'center',
                    marginRight: 5,
                  }}
                  key={date.getTime()}>
                  <PrimaryText
                    styles={{
                      fontSize: StyleConstants.extraSmallFont,
                    }}>
                    {date.getMonth() + 1 + '/' + date.getDate()}
                  </PrimaryText>
                </View>
              ))}
            </View>
            <FlexBox
              column
              borderLeftWidth={1}
              borderLeftColor={rgba(Colors.whiteRbg, 0.5)}
              width="90%">
              {data.map(d => (
                <GroupedChart
                  key={d.date.getTime()}
                  data={d}
                  largestNum={largestNum}
                />
              ))}
            </FlexBox>
          </View>
        </ScrollView>
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default StackedBarChart;

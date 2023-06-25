import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, StyleConstants, rgba } from '@app/utils';
import React, { FC } from 'react';
import { ScrollView } from 'react-native';
import Empty from 'src/components/analytics/Empty';

type DataProps = {
  date: Date;
  dateFormatted: string;
  value: number;
  valueStr: string | undefined;
  _id?: string;
};

type Props = {
  data: DataProps[];
  largestNum: number;
};

const StackedBarChart: FC<Props> = ({ data, largestNum }) => {
  return (
    <FlexBox column flex={1} padding={15}>
      {data.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map(({ dateFormatted, date, value, valueStr, _id }) => {
            let width = Math.round((value / largestNum) * 85);
            if (value !== 0 && width < 5) width = 1;
            return (
              <FlexBox key={_id ?? date.getTime()}>
                <PrimaryText
                  styles={{
                    fontSize: StyleConstants.extraSmallFont,
                  }}>
                  {dateFormatted}
                </PrimaryText>
                <FlexBox
                  width={width + '%'}
                  height="100%"
                  backgroundColor={rgba(Colors.whiteRbg, 0.4)}
                  marginLeft={5}
                  borderTopRightRadius={10}
                  borderBottomRightRadius={10}
                />
                <PrimaryText position="absolute" right={0} size="small">
                  {valueStr}
                </PrimaryText>
              </FlexBox>
            );
          })}
        </ScrollView>
      ) : (
        <Empty />
      )}
    </FlexBox>
  );
};

export default StackedBarChart;

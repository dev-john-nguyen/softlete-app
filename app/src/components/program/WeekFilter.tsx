import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import PrimaryText from '../elements/PrimaryText';
import { FlexBox } from '@app/ui';

interface Props {
  weeks: string[];
  curWeek: number;
  setCurWeek: React.Dispatch<React.SetStateAction<number>>;
}

const WeekFilter = ({ weeks, curWeek, setCurWeek }: Props) => {
  const renderItem = useCallback(
    ({ index }: { item: string; index: number }) => {
      return (
        <FlexBox
          column
          borderBottomColor={
            curWeek === index ? BaseColors.white : 'transparent'
          }
          justifyContent="center"
          alignItems="center"
          borderBottomWidth={1}
          marginLeft={10}
          padding={3}
          onPress={() => setCurWeek(index)}>
          <PrimaryText opacity={curWeek === index ? 1 : 0.5} bold>
            {(index + 1).toString()}
          </PrimaryText>
        </FlexBox>
      );
    },
    [curWeek, setCurWeek],
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
      data={weeks}
      horizontal={true}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: StyleConstants.baseMargin,
  },
});
export default WeekFilter;

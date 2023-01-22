import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import SearchBar from './elements/SearchBar';
import BaseColors from '../utils/BaseColors';
import StyleConstants, { moderateScale } from './tools/StyleConstants';
import FilterSvg from '../assets/FilterSvg';
import { normalize } from '../utils/tools';
import BellSvg from '../assets/BellSvg';
import { FlexBox } from '@app/ui';

interface Props {
  onSearch: (txt: string) => Promise<void>;
  onChange?: (txt: string) => Promise<void>;
  onNotification?: () => void;
  onFilter?: () => void;
}

const SearchHeader = ({
  onSearch,
  onNotification,
  onFilter,
  onChange,
}: Props) => {
  return (
    <FlexBox marginLeft={10} flex={1}>
      <SearchBar onSearch={onSearch} placeholder="Search" onChange={onChange} />
      {onFilter && (
        <View style={styles.filterContainer}>
          <Pressable style={styles.filter} hitSlop={5} onPress={onFilter}>
            <FilterSvg fillColor={BaseColors.black} />
          </Pressable>
        </View>
      )}
      {onNotification && (
        <Pressable style={styles.menu} onPress={onNotification} hitSlop={5}>
          <BellSvg strokeColor={BaseColors.white} />
        </Pressable>
      )}
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: StyleConstants.smallMargin,
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
    alignItems: 'center',
  },
  filterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: StyleConstants.smallMargin,
  },
  menu: {
    marginLeft: StyleConstants.baseMargin,
    height: moderateScale(25),
    width: moderateScale(25),
  },
  filter: {
    height: normalize.width(25),
    width: normalize.width(25),
  },
});
export default SearchHeader;

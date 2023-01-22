import React, { useCallback } from 'react';
import { StyleSheet, ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MarkerProps } from '../../../types/route/route.types';
import StyleConstants from '../../tools/StyleConstants';
import MapRouteItem from './MapRouteItem';

interface Props {
  markers: MarkerProps[];
  activeMarkIndex?: number;
  setActiceMarkIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const MapRouteContents = ({
  markers,
  activeMarkIndex,
  setActiceMarkIndex,
}: Props) => {
  const onItemPress = (index: number) => () => setActiceMarkIndex(index);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<MarkerProps>) => (
      <MapRouteItem
        {...item}
        onPress={onItemPress(index)}
        active={index === activeMarkIndex}
      />
    ),
    [markers, activeMarkIndex],
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={markers}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item, index) => (item.name ? item.name : index.toString())}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: StyleConstants.baseMargin,
  },
  contentContainer: {
    paddingRight: StyleConstants.baseMargin,
  },
});
export default MapRouteContents;

import Icon, { IconOptions } from '@app/icons';
import { Colors } from '@app/utils';
import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { normalize } from '../../utils/tools';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';

interface MenuItemProps {
  children: any;
  onPress: () => void;
  active: boolean;
}

const MenuItem = ({ children, onPress, active }: MenuItemProps) => {
  return (
    <Pressable
      style={[
        styles.menuItemContainer,
        {
          borderBottomWidth: active ? 1 : 0,
          height: moderateScale(30),
          width: moderateScale(30),
          opacity: active ? 1 : 0.2,
          alignItems: 'center',
        },
      ]}
      onPress={onPress}
      hitSlop={10}>
      {children}
    </Pressable>
  );
};

interface Props {
  childrens: any[];
  navItems: IconOptions[];
  navItemSize?: number;
}

const PaginatedHorizontalList = ({
  childrens,
  navItems,
  navItemSize = 25,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>();

  const onPress = (targetIndex: number) => () =>
    scrollRef.current?.scrollTo({ x: normalize.width(1) * targetIndex });

  const onMomentumScrollEnd = (e: any) => {
    const { nativeEvent } = e;
    const index = Math.round(nativeEvent.contentOffset.x / normalize.width(1));
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {navItems.map((icon, index) => (
          <MenuItem
            active={activeIndex === index}
            onPress={onPress(index)}
            key={index}>
            <Icon icon={icon} size={navItemSize} color={Colors.white} />
          </MenuItem>
        ))}
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        {childrens.map((child, index) => (
          <View style={styles.childrenContainer} key={index}>
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenContainer: {
    width: normalize.width(1),
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: StyleConstants.smallMargin,
  },
  menuItemContainer: {
    borderBottomColor: Colors.white,
    paddingBottom: 5,
  },
  menuItemText: {
    fontSize: StyleConstants.extraSmallFont,
    color: Colors.lightWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
export default PaginatedHorizontalList;

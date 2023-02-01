import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import { normalize } from '../../utils/tools';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PlusSvg from '../../assets/PlusSvg';
import { moderateScale } from '../tools/StyleConstants';

interface Props {
  onPress: () => void;
  style?: StyleProp<any>;
}

const CircleAdd = ({ onPress, style }: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.plus}>
        <PlusSvg strokeColor={BaseColors.lightPrimary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: rgba(BaseColors.whiteRbg, 0.8),
    padding: moderateScale(8),
    alignSelf: 'center',
    position: 'absolute',
    bottom: '5%',
    zIndex: 1,
    borderWidth: 1,
    borderColor: rgba(BaseColors.whiteRbg, 1),
  },
  plus: {
    width: normalize.width(20),
    height: normalize.width(20),
  },
});
export default CircleAdd;

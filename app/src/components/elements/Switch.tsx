import React from 'react';
import {Switch} from 'react-native';
import {StyleProp, StyleSheet} from 'react-native';
import {normalize} from '../../utils/tools';
import BaseColors, {rgba} from '../../utils/BaseColors';

interface Props {
  styles?: StyleProp<any>;
  onSwitch: () => void;
  active: boolean;
}

export default ({styles, onSwitch, active}: Props) => (
  <Switch
    trackColor={{false: rgba(BaseColors.whiteRbg, 0.5), true: BaseColors.white}}
    thumbColor={active ? BaseColors.primary : BaseColors.white}
    ios_backgroundColor={'transparent'}
    onValueChange={onSwitch}
    value={active}
    style={styles}
  />
);

const baseStyles = StyleSheet.create({
  base: {
    height: normalize.width(20),
    width: normalize.width(20),
    borderRadius: 100,
  },
});

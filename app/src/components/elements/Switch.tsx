import { Colors, rgba } from '@app/utils';
import React from 'react';
import { Switch } from 'react-native';
import { StyleProp } from 'react-native';

interface Props {
  styles?: StyleProp<any>;
  onSwitch: () => void;
  active: boolean;
}

const CustomSwitch = ({ styles, onSwitch, active }: Props) => (
  <Switch
    trackColor={{
      false: rgba(Colors.whiteRbg, 0.5),
      true: rgba(Colors.whiteRbg, 0.1),
    }}
    thumbColor={active ? Colors.white : rgba(Colors.whiteRbg, 0.5)}
    ios_backgroundColor={'transparent'}
    onValueChange={onSwitch}
    value={active}
    style={styles}
  />
);

export default CustomSwitch;

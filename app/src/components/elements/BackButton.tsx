import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Chevron from '../../assets/ChevronSvg';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';

interface Props {
  onPress: () => void;
  color?: string;
  rotateBack: string;
}

const BackButton = ({ onPress, color, rotateBack }: Props) => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          transform: [{ rotate: `${rotateBack}deg` }],
          borderColor: color ? color : BaseColors.lightWhite,
        },
      ]}
      onPress={onPress}
      hitSlop={5}>
      <Chevron strokeColor={color ? color : BaseColors.lightWhite} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateScale(30),
    width: moderateScale(30),
    padding: 10,
    borderRadius: 100,
    borderWidth: 2,
  },
});
export default BackButton;

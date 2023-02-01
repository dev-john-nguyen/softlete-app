import { Colors, rgba } from '@app/utils';
import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import PlusSvg from '../../assets/PlusSvg';
import { moderateScale } from '../tools/StyleConstants';

interface Props {
  onPress: () => void;
  style?: StyleProp<any>;
  size?: number;
}

const CircleAdd = ({ onPress, style, size }: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View
        style={{
          width: size ? moderateScale(size) : moderateScale(20),
          height: size ? moderateScale(size) : moderateScale(20),
        }}>
        <PlusSvg strokeColor={Colors.lightPrimary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: rgba(Colors.whiteRbg, 0.8),
    padding: moderateScale(8),
    alignSelf: 'center',
    position: 'absolute',
    bottom: '5%',
    zIndex: 1,
    borderWidth: 1,
    borderColor: rgba(Colors.whiteRbg, 1),
  },
});
export default CircleAdd;

import { Colors, rgba } from '@app/utils';
import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import PlusSvg from '../../assets/PlusSvg';
import { moderateScale } from '../tools/StyleConstants';

interface Props {
  onPress?: () => void;
  style?: StyleProp<any>;
  size?: number;
  onPressIn?: () => void;
  isLoading?: boolean;
}

const CircleAdd = ({ onPress, style, size, onPressIn, isLoading }: Props) => {
  return (
    <Pressable
      onPress={isLoading ? undefined : onPress}
      onPressIn={onPressIn}
      style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <View
          style={{
            width: size ? moderateScale(size) : moderateScale(20),
            height: size ? moderateScale(size) : moderateScale(20),
          }}>
          <PlusSvg strokeColor={Colors.white} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: Colors.lightPrimary,
    padding: moderateScale(8),
    alignSelf: 'center',
    position: 'absolute',
    bottom: '5%',
    zIndex: 1,
    borderWidth: 2,
    borderColor: rgba(Colors.whiteRbg, 1),
  },
});
export default CircleAdd;

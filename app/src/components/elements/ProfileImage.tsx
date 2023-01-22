import Icon from '@app/icons';
import { Colors, useResizeStyles } from '@app/utils';
import React from 'react';
import { View, StyleSheet, StyleProp } from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  imageUri?: string;
}

const ProfileImage: React.FC<Props & StyleProp<any>> = ({
  imageUri,
  ...viewStyles
}) => {
  if (imageUri)
    return (
      <FastImage
        style={[styles.container, useResizeStyles(viewStyles)]}
        source={{
          uri: imageUri,
          priority: 'normal',
        }}
      />
    );

  return (
    <View
      style={[
        styles.container,
        useResizeStyles(viewStyles),
        { borderWidth: 2 },
      ]}>
      <Icon icon="person" size={30} strokeColor={Colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    marginRight: 5,
    borderRadius: 100,
    borderColor: Colors.white,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: '100%',
  },
});
export default ProfileImage;

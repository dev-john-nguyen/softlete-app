import Icon from '@app/icons';
import { Colors, useResizeStyles } from '@app/utils';
import React from 'react';
import { View, StyleSheet, StyleProp } from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  imageUri?: string;
  iconSize?: number;
}

const ProfileImage: React.FC<Props & StyleProp<any>> = ({
  imageUri,
  iconSize = 25,
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
    <View style={styles.container}>
      <Icon icon="person" size={iconSize} strokeColor={Colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: '100%',
  },
});
export default ProfileImage;

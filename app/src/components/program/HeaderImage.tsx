import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import LogoSvg from '../../assets/LogoSvg';
import FastImage from 'react-native-fast-image';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';

interface Props {
  uri: string | undefined;
  onPress?: () => void;
  container?: StyleProp<any>;
}

const ProgramHeaderImage = ({ uri, onPress, container }: Props) => {
  return (
    <Pressable style={[styles.container, container]} onPress={onPress}>
      {uri ? (
        <FastImage style={[styles.image, container]} source={{ uri: uri }} />
      ) : (
        <FlexBox
          height="100%"
          width="100%"
          borderRadius={10}
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor={Colors.white}>
          <View style={{ width: '13%' }}>
            <LogoSvg secondary />
          </View>
        </FlexBox>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    ...Colors.lightBoxShadow,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
export default ProgramHeaderImage;

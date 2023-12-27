import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, moderateScale, rgba } from '@app/utils';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import AddImageSvg from '../../../assets/AddImageSvg';
import { ImageProps } from '../../../services/user/types';

interface Props {
  allowUpload: boolean;
  setImage: (img: ImageProps) => void;
  image: ImageProps | undefined;
  imageUri?: string;
  hideSvg?: boolean;
}

const imageOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 1000,
  maxHeight: 1200,
  quality: 1,
  selectionLimit: 1,
  includeBase64: true,
};

const ReflectionImage = ({
  allowUpload,
  setImage,
  image,
  imageUri,
  hideSvg = false,
}: Props) => {
  const onSelectImage = async () => {
    if (!allowUpload) return;
    launchImageLibrary(
      imageOptions,
      ({ errorCode, errorMessage, didCancel, assets }) => {
        if (didCancel) {
          //user canceled
          return;
        }
        if (errorCode) {
          console.log(errorMessage);
          return;
        }

        //get image base64 string
        if (!assets) {
          console.log('nothing selected');
          return;
        }

        const selected = assets[0];

        if (selected.base64 && selected.uri) {
          setImage({
            base64: selected.base64,
            uri: selected.uri,
          });
        }
        //try again
      },
    );
  };

  const svgElement = (() => {
    if (allowUpload && !hideSvg) {
      return (
        <Pressable style={styles.addSvg} onPress={onSelectImage}>
          <AddImageSvg fillColor={rgba(Colors.lightWhiteRgb, 0.6)} />
        </Pressable>
      );
    } else {
      if (!imageUri && !image?.uri) {
        return (
          <FlexBox
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            column>
            <Icon icon="logo" size={50} variant="secondary" opacity={0.9} />
          </FlexBox>
        );
      }
    }
  })();

  return (
    <View
      style={[
        styles.container,
        { borderWidth: imageUri || (image && image.uri) ? 0 : 1 },
      ]}>
      <Icon
        onPress={onSelectImage}
        icon="pencil"
        size={20}
        containerStyles={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 100,
        }}
        color={Colors.white}
      />
      <FastImage
        style={styles.image}
        source={{ uri: image && image.uri ? image.uri : imageUri }}
      />
      {svgElement}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 3 / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: rgba(Colors.whiteRbg, 0.5),
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addSvg: {
    width: moderateScale(70),
    height: moderateScale(70),
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: rgba(Colors.whiteRbg, 0.2),
    borderRadius: 100,
    padding: moderateScale(20),
  },
});
export default ReflectionImage;

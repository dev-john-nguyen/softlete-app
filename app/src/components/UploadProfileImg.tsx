import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import Colors from '../utils/BaseColors';
import { ImageProps } from '../services/user/types';
import FastImage from 'react-native-fast-image';
import StyleConstants from './tools/StyleConstants';
import BaseColors from '../utils/BaseColors';
import AddImageSvg from '../assets/AddImageSvg';
import SecondaryText from './elements/SecondaryText';
import { PrimaryText } from './elements';

const imageOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 500,
  maxHeight: 500,
  quality: 1,
  selectionLimit: 1,
  includeBase64: true,
};

interface Props {
  onImageUpload: (img: ImageProps) => void;
  uri: string | undefined;
}

const UploadProfileImg = ({ onImageUpload, uri }: Props) => {
  const onSelectImage = async () => {
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
          onImageUpload({
            base64: selected.base64,
            uri: selected.uri,
          });
        }
        //try again
      },
    );
  };

  return (
    <Pressable style={styles.container} onPress={onSelectImage}>
      {uri ? (
        <FastImage source={{ uri: uri }} style={styles.image} />
      ) : (
        <View style={styles.image}>
          <View style={styles.svg}>
            <AddImageSvg fillColor={BaseColors.white} />
          </View>
        </View>
      )}
      <Pressable onPress={onSelectImage} style={styles.changeContainer}>
        <PrimaryText variant="secondary" fontSize={14}>
          Change Profile Photo
        </PrimaryText>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
    marginTop: StyleConstants.smallMargin,
  },
  svg: {
    width: '30%',
  },
  changeContainer: {
    marginTop: 10,
  },
});
export default UploadProfileImg;

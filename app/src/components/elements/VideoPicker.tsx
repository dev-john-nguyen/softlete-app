import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import Constants from '../../utils/Constants';
import VideoView from './Video';
import {normalize} from '../../utils/tools';
import AddImageSvg from '../../assets/AddImageSvg';
import {AppDispatch} from '../../../App';
import {setBanner} from '../../services/banner/actions';
import {BannerTypes} from '../../services/banner/types';

interface Props {
  uri: string;
  setUri: (uri: string) => void;
  dispatch: AppDispatch;
  thumbnail: string;
}

const videoOptions: ImageLibraryOptions = {
  mediaType: 'video',
  quality: 1,
  videoQuality: 'high',
  selectionLimit: 1,
  maxHeight: 1000,
  maxWidth: 1000,
};

const VideoPicker = ({uri, setUri, dispatch, thumbnail}: Props) => {
  const onSelectVideo = () => {
    launchImageLibrary(
      videoOptions,
      ({errorCode, errorMessage, didCancel, assets}) => {
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

        if (selected && selected.uri && selected.duration) {
          if (selected.duration <= 30) {
            setUri(selected.uri);
          } else {
            dispatch(
              setBanner(
                BannerTypes.warning,
                'Video duration must be 30 secs or less.',
              ),
            );
          }
        }

        //try again
      },
    );
  };

  return (
    <View style={styles.content}>
      {!!uri ? (
        <VideoView url={uri} thumbnail={thumbnail} large />
      ) : (
        <View
          style={{
            ...Constants.videoDim,
            borderColor: BaseColors.lightGrey,
            borderWidth: 1,
            borderRadius: StyleConstants.borderRadius,
          }}></View>
      )}
      <Pressable style={styles.image}>
        <Pressable style={styles.svg} onPress={onSelectVideo}>
          <AddImageSvg fillColor={BaseColors.primary} />
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: StyleConstants.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  image: {
    width: normalize.width(7),
    height: normalize.width(7),
    backgroundColor: BaseColors.white,
    opacity: 0.8,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
  },
  svg: {
    width: '40%',
  },
});

export default VideoPicker;

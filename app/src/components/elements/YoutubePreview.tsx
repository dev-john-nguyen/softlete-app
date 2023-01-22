import React, { useEffect, useState } from 'react';
import { View, Pressable, Linking } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import FastImage from 'react-native-fast-image';
import Constants from '../../utils/Constants';
import { getYoutubeThumbNail, getYoutubeUrl } from '../../utils/tools';
import { FlexBox } from '@app/ui';

interface Props {
  id: string | undefined;
  small?: boolean;
}

const ExerciseYoutubePreview = ({ id, small }: Props) => {
  const [failed, setFailed] = useState(false);
  const [thumbNail, setThumbNail] = useState('');

  useEffect(() => {
    getThumbNail();
  }, [id]);

  const getThumbNail = async () => {
    if (!id) return;
    setThumbNail(getYoutubeThumbNail(id));
    setFailed(false);
  };

  const onOpenUrl = async () => {
    if (!id) return;
    const url = getYoutubeUrl(id);
    const supportedUrl = await Linking.canOpenURL(url).catch(err => {
      console.log(err);
    });

    if (supportedUrl) {
      await Linking.openURL(url).catch(err => {
        console.log(err);
        console.log('Failed to open youtube url');
      });
    } else {
      console.log('Failed to open youtube url');
    }
  };

  const videoStyle = {
    ...(small ? Constants.videoSmallDim : Constants.videoMedDim),
    borderColor: BaseColors.lightGrey,
    borderWidth: 1,
    borderRadius: small ? 5 : StyleConstants.borderRadius,
  };

  return (
    <FlexBox>
      {!!thumbNail && !failed ? (
        <Pressable onPress={onOpenUrl}>
          <FastImage
            source={{ uri: thumbNail }}
            onError={() => setFailed(true)}
            style={videoStyle}
          />
        </Pressable>
      ) : (
        <View style={videoStyle} />
      )}
    </FlexBox>
  );
};

export default ExerciseYoutubePreview;

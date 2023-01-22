import React from 'react';
import { StyleSheet, View } from 'react-native';
import VideoView from './Video';

interface Props {
  props: {
    url?: string;
    thumbnail?: string;
    localThumbnail?: string;
    localUrl?: string;
  };
  small?: boolean;
}

const ExerciseVideo = ({ props, small }: Props) => {
  //get video urls
  let url = '';
  let thumbnail = '';
  if (props) {
    if (props.url && props.thumbnail) {
      url = props.url;
      thumbnail = props.thumbnail;
    } else if (props.localUrl && props.localThumbnail) {
      url = props.localUrl;
      thumbnail = props.localThumbnail;
    }
  }

  return <VideoView small={small} url={url} thumbnail={thumbnail} />;
};

export default React.memo(ExerciseVideo);

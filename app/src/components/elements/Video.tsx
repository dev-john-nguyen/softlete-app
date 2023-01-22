import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Video from 'react-native-video';
import Constants from '../../utils/Constants';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import ErrorSvg from '../../assets/ErrorSvg';
import FastImage from 'react-native-fast-image';

interface Props {
    url?: string;
    thumbnail?: string;
    small?: boolean;
    large?: boolean
}


const VideoView = ({ url, thumbnail, small, large }: Props) => {
    const [show, setShow] = useState(false);
    const [err, setErr] = useState(false);

    const size = small ? Constants.videoSmallDim : large ? Constants.videoDim : Constants.videoMedDim;
    const borderRadius = small ? 5 : StyleConstants.borderRadius

    if (!thumbnail || !url) return (
        <View style={{
            ...size,
            borderColor: BaseColors.lightGrey,
            borderWidth: 1,
            borderRadius: borderRadius,
            alignSelf: 'flex-start'
        }} />
    )

    return (
        <Pressable onPress={() => setShow(true)} style={styles.container}>
            <FastImage source={{ uri: thumbnail }} style={[styles.thumbnail, { ...size, borderRadius: borderRadius }]} />
            <Video source={{ uri: url }}
                // onBuffer={(res) => console.log(res)}
                onError={(err) => {
                    console.log(err)
                    setErr(true)
                }}
                paused={true}
                fullscreen={show}
                onFullscreenPlayerDidDismiss={() => setShow(false)}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    err: {
        position: 'absolute',
        zIndex: 100
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderColor: BaseColors.lightGrey,
        borderWidth: 1
    }
})
export default React.memo(VideoView);
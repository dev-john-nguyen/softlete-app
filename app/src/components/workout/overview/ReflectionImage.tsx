import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ImageLibraryOptions, launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AddImageSvg from '../../../assets/AddImageSvg';
import { ImageProps } from '../../../services/user/types';
import BaseColors, { rgba } from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants, { moderateScale } from '../../tools/StyleConstants';


interface Props {
    allowUpload: boolean;
    setImage: (img: ImageProps) => void;
    image: ImageProps | undefined;
    imageUri?: string;
}

const imageOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 1000,
    maxHeight: 1200,
    quality: 1,
    selectionLimit: 1,
    includeBase64: true,
}

const ReflectionImage = ({ allowUpload, setImage, image, imageUri }: Props) => {
    const onSelectImage = async () => {
        if (!allowUpload) return;
        launchImageLibrary(imageOptions, ({ errorCode, errorMessage, didCancel, assets }) => {
            if (didCancel) {
                //user canceled
                return;
            }
            if (errorCode) {
                console.log(errorMessage)
                return;
            }

            //get image base64 string
            if (!assets) {
                console.log('nothing selected')
                return
            }

            const selected = assets[0];

            if (selected.base64 && selected.uri) {
                setImage({
                    base64: selected.base64,
                    uri: selected.uri
                })
            }
            //try again
        })
    }

    const renderSvg = () => {
        if (allowUpload) {
            if (!imageUri && !image?.uri) {
                return (
                    <Pressable style={styles.addSvg} onPress={onSelectImage}>
                        <AddImageSvg fillColor={rgba(BaseColors.lightWhiteRgb, .6)} />
                    </Pressable>
                )
            }
        } else {
            if (!imageUri && !image?.uri) {
                return <SecondaryText styles={styles.noImage}>No Image</SecondaryText>
            }
        }
    }

    return (
        <View style={styles.container}>
            <FastImage
                style={styles.image}
                source={{ uri: (image && image.uri) ? image.uri : imageUri }}
            />
            {renderSvg()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
        height: normalize.width(1.6),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        color: BaseColors.secondary,
        position: 'absolute'
    },
    addSvg: {
        width: moderateScale(70),
        height: moderateScale(70),
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: rgba(BaseColors.whiteRbg, .2),
        borderRadius: 100,
        padding: moderateScale(20)
    }
})
export default ReflectionImage;
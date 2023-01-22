import React from 'react';
import { View, StyleSheet, Pressable, StyleProp } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import LogoSvg from '../../assets/LogoSvg';
import FastImage from 'react-native-fast-image';


interface Props {
    uri: string | undefined;
    onPress?: () => void;
    container?: StyleProp<any>;
}


const ProgramHeaderImage = ({ uri, onPress, container }: Props) => {
    return (
        <Pressable
            style={[styles.container, container]}
            onPress={onPress}
        >
            {
                !!uri ? <FastImage
                    style={[styles.image, container]}
                    source={{ uri: uri }}
                /> :
                    <View style={{ width: '13%' }}>
                        <LogoSvg secondary />
                    </View>
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: BaseColors.white,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 10,
        ...BaseColors.lightBoxShadow
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    }
})
export default ProgramHeaderImage;
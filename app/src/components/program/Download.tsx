import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import DownloadSvg from '../../assets/DownloadSvg';
import BaseColors, { rgba } from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';


interface Props {
    onDownload: () => void;
}


const ProgramDownload = ({ onDownload }: Props) => {
    return (
        <Pressable onPress={onDownload} style={[styles.container, BaseColors.primaryBoxShadow]}>
            <View style={styles.svg}>
                <DownloadSvg color={BaseColors.primary} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        padding: 10,
        backgroundColor: rgba(BaseColors.whiteRbg, .8),
        position: 'absolute',
        left: '45%',
        bottom: '5%'
    },
    svg: {
        width: normalize.width(20),
        height: normalize.width(20)
    }
})
export default ProgramDownload;
import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { PositionProps } from './types';
import TrashSvg from '../../assets/TrashSvg';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';

interface Props {
    setTrashPos: React.Dispatch<React.SetStateAction<PositionProps>>;
}

const TrashBin = ({ setTrashPos }: Props) => {

    const onLayout = (e: LayoutChangeEvent) => {
        if (!e) return;
        const { height, width, x, y } = e.nativeEvent.layout;
        setTrashPos({ height, width, x, y })
    }

    return (
        <View
            onLayout={onLayout}
            style={styles.container}
        >
            <View style={styles.svg}>
                <TrashSvg fillColor={BaseColors.black} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: StyleConstants.baseMargin,
        height: normalize.width(8),
        width: normalize.width(8),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        height: normalize.width(15),
        width: normalize.width(15),
    }
})
export default TrashBin;
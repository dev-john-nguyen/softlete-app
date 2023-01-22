import React, { } from 'react';
import { View, StyleSheet } from 'react-native';
import BaseColors, { rgba } from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';


interface Props {
    props: {
        x: number;
        y: number;
        index: number;
        indexData: number;
    }
    isActive: boolean;
    dates: Date[]
}


const GraphItem = ({ props, isActive, dates }: Props) => {

    const getDate = () => {
        const d = dates.find((_, i) => i === props.index)
        if (d) {
            return (d.getMonth() + 1) + '/' + d.getDate()
        }
        return ''
    }


    return <View style={[{
        left: props.x - 20,
        top: props.y + 10,
        opacity: isActive ? 1 : 0,
    }, styles.container]}>
        <SecondaryText styles={{ fontSize: 10, color: BaseColors.white }}>{getDate()}</SecondaryText>
        <SecondaryText styles={{ fontSize: 14, color: BaseColors.white }} bold>{props.indexData}</SecondaryText>
    </View>
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2000,
        backgroundColor: rgba(BaseColors.whiteRbg, .2),
        padding: 10,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 10,
        alignItems: 'center'
    }
})
export default GraphItem;
import React from 'react';
import { StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import Constants from '../../utils/Constants';
import BaseColors from '../../utils/BaseColors';
import { GroupPosProps } from './types';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';
import { normalize } from '../../utils/tools';


interface Props {
    group: string;
    onChangeGroup: (g: string) => void;
    setItemPos: React.Dispatch<React.SetStateAction<GroupPosProps>>;
    curGroup: string;
}

const arePropsEqual = (prevProps: Props, nextProps: Props) => {
    return (
        prevProps.group === nextProps.group
        && prevProps.curGroup === nextProps.curGroup
    )
}


const HeaderItem = React.memo(({ group, setItemPos, onChangeGroup, curGroup }: Props) => {

    const onPress = () => onChangeGroup(group)

    const onLayout = (e: LayoutChangeEvent) => {
        if (!e) return;
        const { height, width, x, y } = e.nativeEvent.layout;
        setItemPos(state => ({
            ...state,
            [group]: { height, width, x, y }
        }))
    }

    return (
        <Pressable
            onLayout={onLayout}
            onPress={onPress}
            style={[styles.container, {
                borderColor: curGroup === group ? BaseColors.primary : BaseColors.secondary
            }]}
        >
            <PrimaryText styles={[styles.text, {
                color: curGroup === group ? BaseColors.primary : BaseColors.secondary
            }]}>{Constants.abc[parseInt(group)]}</PrimaryText>
        </Pressable>
    )
}, arePropsEqual)

const styles = StyleSheet.create({
    container: {
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize.width(8),
        width: normalize.width(7),
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderRightWidth: 1.5,
        borderLeftWidth: 1.5,
        borderBottomWidth: 1.5,
    },
    text: {
        fontSize: StyleConstants.mediumFont,
    }
})
export default HeaderItem;
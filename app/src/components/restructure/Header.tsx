import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, LayoutChangeEvent, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { GroupPosProps, PositionProps } from './types';
import HeaderItem from './HeaderItem';
import { normalize } from '../../utils/tools';
import TrashBin from './TrashBin';


interface Props {
    groupsProps: string[];
    curGroup: string;
    onChangeGroup: (g: string) => void;
    headerPos: Animated.SharedValue<{
        x: number;
        y: number;
    }>
    setGroupsPos: React.Dispatch<React.SetStateAction<GroupPosProps>>;
    setTrashPos: React.Dispatch<React.SetStateAction<PositionProps>>;
}

const ReorderHeader = ({ curGroup, groupsProps, onChangeGroup, headerPos, setGroupsPos, setTrashPos }: Props) => {
    const [itemPos, setItemPos] = useState<GroupPosProps>({})



    useLayoutEffect(() => {
        //not sure if this is efficent or reliable
        setGroupsPos((groupPos) => {
            if (Object.keys(itemPos).length === groupsProps.length) {
                return { ...itemPos }
            }
            return groupPos
        })
    }, [itemPos])

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        headerPos.value = {
            ...headerPos.value,
            x: event.nativeEvent.contentOffset.x
        }
    };

    const onScrollViewLayout = (e: LayoutChangeEvent) => {
        const { height, y } = e.nativeEvent.layout;
        headerPos.value = {
            ...headerPos.value,
            y: height + y
        }
    }


    return (
        <ScrollView
            onLayout={onScrollViewLayout}
            horizontal={true}
            style={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.contentContainerStyle}>
            <TrashBin setTrashPos={setTrashPos} />
            {
                groupsProps.map((group) => {
                    return <HeaderItem
                        key={group}
                        curGroup={curGroup}
                        group={group}
                        onChangeGroup={onChangeGroup}
                        setItemPos={setItemPos}
                    />
                })
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    contentContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingRight: '20%'
    },
    groupContainer: {
        marginRight: 20
    },
    save: {
        width: normalize.width(15),
        height: normalize.width(15)
    }
})
export default ReorderHeader;
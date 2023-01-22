import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ViewToken } from 'react-native';
import { GeneratedProgramProps } from '../../services/program/types';
import SecondaryText from '../elements/SecondaryText';
import StyleBase from '../tools/StyleBase';
import StyleConstants from '../tools/StyleConstants';
import { normalize } from '../../utils/tools';
import BaseColors from '../../utils/BaseColors';
import ScrollSvg from '../../assets/ScrollSvg';


interface Props {
    genPrograms: GeneratedProgramProps[];
    programUid: string;
    setProgramUid: React.Dispatch<React.SetStateAction<string>>;
}

interface InfoProps {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

const GenProgramsSelectList = ({ programUid, genPrograms, setProgramUid }: Props) => {
    const listRef = useRef<any>();
    const [width, setWidth] = useState(0);
    //only scroll one at the beginning

    useLayoutEffect(() => {
        if (listRef.current) {
            let targetIndex = genPrograms.findIndex(val => val._id === programUid);
            listRef.current.scrollToIndex({ index: targetIndex > -1 ? targetIndex : 0, animated: false });
        }
    }, [programUid])

    const onViewableItemsChanged = useCallback(({ viewableItems }: InfoProps) => {
        for (let i = 0; i < viewableItems.length; i++) {
            const item = viewableItems[i];
            if (item.isViewable && item.index != null) {
                setProgramUid(item.item._id)
                return;
            }
        }
    }, [])

    const renderItem = useCallback(({ item }: { item: GeneratedProgramProps }) => {
        return (
            <View style={[styles.itemContainer, { width }]}>
                <SecondaryText
                    styles={[styles.optionTxt, {
                        color: '' === item._id ? BaseColors.secondary : BaseColors.black,
                        fontSize: StyleConstants.smallFont
                    }]}
                >{'' === item._id ? 'Programs' : item.name}</SecondaryText>
            </View>
        )
    }, [genPrograms, width])

    console.log(genPrograms)

    return (
        <View style={styles.container}>
            <View style={styles.selectionContainer}>
                <View style={styles.chevronContainer}>
                    <View style={styles.chevron}>
                        <ScrollSvg fillColor={BaseColors.white} />
                    </View>
                </View>
                <FlatList
                    ref={listRef}
                    style={styles.scrollContainer}
                    onLayout={(e) => {
                        const { width } = e.nativeEvent.layout;
                        setWidth(width)
                    }}
                    onScrollToIndexFailed={(error) => {
                        setTimeout(() => {
                            listRef.current && listRef.current.scrollToIndex({ index: error.index, animated: false, viewPosition: 0.5 });
                        }, 100);
                    }}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{
                        minimumViewTime: 100,
                        itemVisiblePercentThreshold: 80,
                        waitForInteraction: true
                    }}
                    pagingEnabled={true}
                    data={genPrograms}
                    horizontal
                    keyExtractor={(item, index) => item._id ? item._id : index.toString()}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StyleConstants.baseMargin,
        borderWidth: 1,
        borderColor: BaseColors.lightGrey,
        borderRadius: StyleConstants.borderRadius
    },
    selectionContainer: {
    },
    chevronContainer: {
        backgroundColor: BaseColors.primary,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        height: '100%',
        width: normalize.width(13),
        borderRadius: StyleConstants.borderRadius
    },
    chevron: {
        height: normalize.width(25),
        width: normalize.width(25),
        transform: [{ rotate: '90deg' }]
    },
    scrollContainer: {
        borderRadius: 10,
        backgroundColor: BaseColors.white,
        padding: 5
    },
    label: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.secondary
    },
    itemContainer: {
        justifyContent: 'center',
        padding: StyleConstants.smallPadding,
        borderRadius: 10,
    },
    optionTxt: {
        textTransform: 'capitalize',
    }
})
export default GenProgramsSelectList;
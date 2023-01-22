import React, { useCallback } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import SecondaryText from '../elements/SecondaryText';


interface Props {
    weeks: string[];
    curWeek: number;
    setCurWeek: React.Dispatch<React.SetStateAction<number>>;
}


const WeekFilter = ({ weeks, curWeek, setCurWeek }: Props) => {

    const renderItem = useCallback(({ item, index }: { item: string, index: number }) => {
        return (
            <Pressable
                style={[styles.textContainer, {
                    borderBottomColor: curWeek === index ? BaseColors.white : 'transparent'
                }]}
                onPress={() => setCurWeek(index)}
            >
                <SecondaryText
                    styles={[styles.text, {
                        opacity: curWeek === index ? 1 : .5
                    }]}
                    bold
                >
                    {(index + 1).toString()}
                </SecondaryText>
            </Pressable>
        )
    }, [weeks])


    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={{ alignItems: 'center' }}
            data={weeks}
            horizontal={true}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: StyleConstants.baseMargin
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderBottomWidth: 2,
        marginRight: 5
    },
    text: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.white
    },
    addContainer: {
        height: normalize.width(12),
        width: normalize.width(12),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BaseColors.primary,
        borderRadius: 100,
        marginLeft: StyleConstants.smallMargin
    },
    plus: {
        height: "40%",
        width: "40%",
        zIndex: 1
    }
})
export default WeekFilter;
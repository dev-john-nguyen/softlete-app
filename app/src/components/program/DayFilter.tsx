import React, { useCallback } from 'react';
import { StyleSheet, FlatList, Pressable } from 'react-native';
import StyleConstants from '../tools/StyleConstants';
import Constants from '../../utils/Constants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';

const { daysOfWeek } = Constants;

const daysShort = daysOfWeek.map(d => d.substring(0, 3))


interface Props {
    curDay: number;
    onChangeCurDay: (day: number) => void;
    onLongPress?: (day: number) => void;
    groupByDay?: any;
}


const DayFilter = ({ curDay, onChangeCurDay, onLongPress, groupByDay }: Props) => {


    const renderTotal = (day: string) => {
        if (!groupByDay) return '';

        if (groupByDay[day]) {
            return groupByDay[day].length.toString()
        } else {
            return ''
        }
    }

    const pressableStyle = (pressed: boolean, index: number) => {
        return [styles.itemContainer, {
            borderBottomColor: curDay === index ? BaseColors.white : 'transparent',
        }]
    }

    const renderItem = useCallback(({ item, index }: { item: string, index: number }) => (
        <Pressable style={({ pressed }) => pressableStyle(pressed, index)}
            onPress={() => onChangeCurDay(index)}
            onLongPress={() => onLongPress && onLongPress(index)}
        >
            <SecondaryText
                styles={[styles.text, {
                    color: curDay === index ? BaseColors.white : rgba(BaseColors.whiteRbg, .2)
                }]}
                bold
            >
                {item}
            </SecondaryText>
            <SecondaryText styles={[styles.info, { color: curDay === index ? BaseColors.primary : BaseColors.secondary }]}>
                {renderTotal(index.toString())}
            </SecondaryText>
        </Pressable>
    ), [groupByDay, curDay])

    return (
        <FlatList
            style={styles.container}
            extraData={groupByDay}
            data={daysShort}
            horizontal={true}
            contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    itemContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        padding: StyleConstants.smallPadding,
    },
    text: {
        fontSize: StyleConstants.smallFont,
        textTransform: 'capitalize'
    },
    info: {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: StyleConstants.smallFont
    }
})
export default DayFilter;
import React from 'react';
import { View, Text, StyleSheet, StyleProp } from 'react-native';
import WeekFilter from './WeekFilter';
import DayFilter from './DayFilter';
import StyleConstants from '../tools/StyleConstants';
import { normalize } from '../../utils/tools';
import { GroupByDayProps } from '../../services/program/types';
import CalendarSvg from '../../assets/CalendarSvg';
import BaseColors from '../../utils/BaseColors';


interface Props {
    weeks: string[];
    curWeek: number;
    setCurWeek: React.Dispatch<React.SetStateAction<number>>;
    curDay: number;
    onChangeCurDay: (day: number) => void;
    onDayLongPress?: (day: number) => void;
    groupByDay?: GroupByDayProps;
    athlete?: boolean;
}


const ProgramFilter = ({ weeks, curWeek, setCurWeek, curDay, onChangeCurDay, onDayLongPress, groupByDay, athlete }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.svg}>
                    <CalendarSvg color={BaseColors.white} />
                </View>
                <WeekFilter
                    weeks={weeks}
                    curWeek={curWeek}
                    setCurWeek={setCurWeek}
                />
            </View>
            <View style={{ marginTop: StyleConstants.baseMargin }}>
                <DayFilter curDay={curDay} onChangeCurDay={onChangeCurDay} onLongPress={onDayLongPress} groupByDay={groupByDay} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    svg: {
        width: normalize.width(15),
        height: normalize.width(15),
        marginRight: StyleConstants.smallMargin,
    }
})
export default ProgramFilter;
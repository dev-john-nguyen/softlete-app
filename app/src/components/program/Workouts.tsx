import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, ViewToken } from 'react-native';
import { WorkoutByWeekProps, ProgramByWeekProps, GroupByDayProps } from '../../services/program/types';
import WorkoutPreviewList from '../workout/preview/PreviewList';
import ProgramFilter from './ProgramFilter';
import { convertObjToDays, groupByDayOfWeek, normalize } from '../../utils/tools';
import { FlatList } from 'react-native-gesture-handler';
import StyleConstants from '../tools/StyleConstants';
import _ from 'lodash';


interface Props {
    onAddWorkout?: (daysFromStart: number, weeks: string[]) => void;
    navToViewWorkout: (workoutUid: string) => void;
    onCopyWorkout?: (workoutUid: string) => void;
    onPasteWorkout?: (daysFromStart: number) => void;
    workoutsObj: ProgramByWeekProps;
    setWorkoutsObj: React.Dispatch<React.SetStateAction<ProgramByWeekProps>>;
    athlete?: boolean;
}

interface InfoProps {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}


const ProgramWorkouts = ({ onAddWorkout, setWorkoutsObj, workoutsObj, navToViewWorkout, onCopyWorkout, onPasteWorkout, athlete }: Props) => {
    const [curWeek, setCurWeek] = useState(0);
    const [curDay, setCurDay] = useState(0);
    const [workouts, setWorkouts] = useState<WorkoutByWeekProps[][]>([[]]);
    const [weeks, setWeeks] = useState<string[]>([])
    const [groupByDay, setGroupByDay] = useState<GroupByDayProps>({});
    const flatListRef: any = useRef();
    const isScrolling = useRef(false);

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }: InfoProps) => {
        for (let i = 0; i < viewableItems.length; i++) {
            const item = viewableItems[i];
            if (item.isViewable && item.index != null && !isScrolling.current) {
                setCurDay(item.index)
                return;
            }
        }
    }, [])

    useEffect(() => {
        //just generate current week workouts in day order
        const curWeekWorkouts: WorkoutByWeekProps[][] = new Array(7).fill([]);
        let daysObj: GroupByDayProps = {};
        let weekKeys: string[] = [];

        if (workoutsObj) {
            if (workoutsObj[curWeek]) {
                //loop through the curreent week and populate amtWktDays
                daysObj = groupByDayOfWeek(workoutsObj[curWeek]);
                //push all workouts into a doubleArray
                //create new array that's a week long
                for (let i = 0; i < curWeekWorkouts.length; i++) {
                    const wos = workoutsObj[curWeek].filter(c => c.dayOfWeek === i)
                    curWeekWorkouts[i] = wos
                }
            }

            weekKeys = Object.keys(workoutsObj)
            //sort the weekKeys
            const max = _.maxBy(weekKeys, (k) => parseInt(k))
            if (max) {
                const newWeek = parseInt(max) + 1
                weekKeys.push(newWeek.toString())
            } else {
                weekKeys.push('0')
            }
        } else {
            weekKeys.push('0')
        }

        //always add one more week
        if (!weekKeys.find(k => k === curWeek.toString())) {
            setCurWeek(0)
        }
        setWeeks(weekKeys)
        setGroupByDay(daysObj);
        setWorkouts(curWeekWorkouts)
    }, [workoutsObj, curWeek])

    useLayoutEffect(() => {
        if (flatListRef.current && isScrolling.current) {
            flatListRef.current.scrollToIndex({ index: curDay })
        }
    }, [curDay])

    const onAddWorkoutPress = () => {
        if (!onAddWorkout) return;
        let week = 0;
        let day = 0;
        let weeks: string[] = [];
        setCurWeek(w => {
            week = w
            return w
        })
        setCurDay(d => {
            day = d
            return d
        })
        setWeeks(ws => {
            weeks = ws
            return ws
        })
        onAddWorkout(convertObjToDays(week, day), weeks)
    }

    const onDayLongPress = (day: number) => onPasteWorkout && onPasteWorkout(convertObjToDays(curWeek, day))

    const onChangeCurDay = (day: number) => {
        isScrolling.current = true;
        setCurDay(day)
    }

    const onMomentumScrollEnd = () => isScrolling.current = false;

    const renderItem = useCallback(({ item }: { item: WorkoutByWeekProps[] }) => {
        return (
            <View style={styles.previewListContainer}>
                <WorkoutPreviewList
                    onLongPress={onCopyWorkout}
                    onPress={navToViewWorkout}
                    workouts={item}
                    onAddWorkout={onAddWorkoutPress}
                    athlete={athlete}
                />
            </View>
        )
    }, [workouts, athlete])

    return (
        <View style={styles.container}>
            <ProgramFilter
                weeks={weeks}
                curWeek={curWeek}
                setCurWeek={setCurWeek}
                curDay={curDay}
                onChangeCurDay={onChangeCurDay}
                onDayLongPress={onDayLongPress}
                groupByDay={groupByDay}
                athlete={athlete}
            />
            <FlatList
                ref={flatListRef}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={onViewableItemsChanged}
                data={workouts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal
                pagingEnabled
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    previewListContainer: {
        width: normalize.width(1),
        padding: StyleConstants.baseMargin
    }
})
export default ProgramWorkouts;
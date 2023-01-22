import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import AthletePreviewItem from '../athletes/WorkoutPreview';
import { AthleteWorkoutsProps } from '../../services/athletes/types';
import PrimaryText from '../elements/PrimaryText';
import DateTools from '../../utils/DateTools';
import Constants from '../../utils/Constants';

interface Props {
    workouts: AthleteWorkoutsProps[];
    onPress: (workoutUid: string) => void;
    onLike: (workoutUid: string) => void;
    onFetchMonths: (add?: boolean) => Promise<void>;
    likedWoIds: string[];
    userUid: string;
}


const AthleteWorkoutPreviewList = ({ workouts, onPress, onFetchMonths, onLike, likedWoIds, userUid }: Props) => {
    const [refreshing, setRefreshing] = useState(false);

    const today = new Date();

    useEffect(() => {
        setRefreshing(false)
    }, [workouts])

    const renderItem = useCallback(({ item }: { item: AthleteWorkoutsProps }) => {

        const mappedWos = item.workouts.map(wo => (
            <AthletePreviewItem
                key={wo._id}
                onPress={onPress}
                onLike={onLike}
                workout={wo}
                likedWoIds={likedWoIds}
                uid={userUid}
            />
        ))

        const d = DateTools.strToDate(item.date);
        let str = ''
        let day = '';
        let isToday = false;

        if (d) {
            str = Constants.months[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
            day = Constants.daysOfWeek[d.getDay()]
            isToday = (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            )
        }

        return (
            <View style={styles.itemContainer}>
                <View style={styles.headerContainer}>
                    <PrimaryText styles={[styles.day, {
                        color: isToday ? BaseColors.black : BaseColors.black
                    }]}>{day}</PrimaryText>
                    <View style={styles.dateContainer}>
                        <SecondaryText styles={[styles.date, {
                            color: isToday ? BaseColors.lightBlack : BaseColors.lightBlack
                        }]} bold>{str}</SecondaryText>
                    </View>
                </View>
                {mappedWos}
            </View>
        )
    }, [workouts, likedWoIds, userUid])

    const renderListEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>

        </View>
    ), [])

    const onRefresh = async (add?: boolean) => {
        setRefreshing(true)
        await onFetchMonths(add)
        setRefreshing(false)
    }

    const onEndReach = () => onRefresh(true)

    return (
        <View style={styles.container}>
            <FlatList
                data={workouts}
                contentContainerStyle={{ paddingBottom: normalize.height(20) }}
                ListEmptyComponent={renderListEmptyComponent}
                keyExtractor={(item, index) => item.date ? item.date : index.toString()}
                renderItem={renderItem}
                onEndReached={onEndReach}
                onEndReachedThreshold={.5}
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={BaseColors.primary}
                    />
                )}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
        marginTop: StyleConstants.smallMargin,
        backgroundColor: BaseColors.white,
        height: '100%',
    },
    itemContainer: {
        paddingRight: StyleConstants.baseMargin,
        paddingLeft: StyleConstants.baseMargin,
        backgroundColor: BaseColors.white,
        marginBottom: StyleConstants.smallMargin,
        paddingTop: StyleConstants.baseMargin,
    },
    headerContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: StyleConstants.smallMargin,
        borderRadius: 5,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    dateContainer: {
    },
    date: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.white,
    },
    day: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.secondary,
        textTransform: 'capitalize'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize.height(10)
    },
    emptyText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.secondary
    }
})
export default AthleteWorkoutPreviewList;
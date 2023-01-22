import _ from 'lodash';
import React, { } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WorkoutTypes } from '../../services/workout/types';
import BaseColors from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import ExerciseChart from '../home/components/ExerciseChart';
import StyleConstants from '../tools/StyleConstants';
import { DataProps, Stats } from './types';


interface Props {
    data: DataProps;
    filter: Stats;
}


const DataOverviewItem = ({ data, filter }: Props) => {

    const renderActivityName = (name: string) => {
        if (name === WorkoutTypes.TraditionalStrengthTraining) {
            return 'Strength Training'
        } else {
            return name
        }
    }

    const renderStatValues = () => {
        switch (filter) {
            case Stats.calories:
                return data.calories.map(d => _.round(d))
            case Stats.distance:
                return data.distance.map(d => _.round(d))
            case Stats.duration:
            default:
                return data.duration.map(d => _.round(d / 1000 / 60))
        }
    }

    const renderLabel = () => {
        switch (filter) {
            case Stats.calories:
                return `kcal`
            case Stats.distance:
                return `mi`
            case Stats.duration:
            default:
                return `mins`
        }
    }

    const renderAvg = (num: number[]) => {
        const avg = _.round(_.mean(num))
        return avg
    }

    const renderMin = (num: number[]) => {
        const min = _.min(num)
        if (!min) return 0
        return _.round(min)
    }

    const renderSum = (num: number[]) => {
        const sum = _.sum(num)
        return _.round(sum)
    }

    const renderMax = (num: number[]) => {
        const max = _.max(num)
        if (!max) return 0
        return _.round(max)
    }

    const renderChartValues = () => {
        return data.data.map(d => {
            switch (filter) {
                case Stats.calories:
                    return {
                        date: DateTools.UTCISOToLocalDate(d.date),
                        value: _.round(d.calories)
                    }
                case Stats.distance:
                    return {
                        date: DateTools.UTCISOToLocalDate(d.date),
                        value: _.round(d.distance)
                    }
                case Stats.duration:
                default:
                    return {
                        date: DateTools.UTCISOToLocalDate(d.date),
                        value: _.round(d.duration / 1000 / 60)
                    }
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SecondaryText styles={styles.headerText} bold>{renderActivityName(data.activityName)}</SecondaryText>
                <View style={styles.measContainer}>
                    <PrimaryText styles={styles.measText}>{renderLabel()}</PrimaryText>
                </View>
            </View>
            <ScrollView style={styles.statsContainer} horizontal>
                <View style={styles.statsItemConatiner}>
                    <View style={styles.statsHeaderContainer}>
                        <SecondaryText styles={styles.statsText}>Total</SecondaryText>
                    </View>
                    <SecondaryText styles={styles.itemText} bold>{renderSum(renderStatValues())} {renderLabel()}</SecondaryText>
                </View>
                <View style={styles.statsItemConatiner}>
                    <View style={styles.statsHeaderContainer}>
                        <SecondaryText styles={styles.statsText}>Min</SecondaryText>
                    </View>
                    <SecondaryText styles={styles.itemText} bold>{renderMin(renderStatValues())} {renderLabel()}</SecondaryText>
                </View>
                <View style={styles.statsItemConatiner}>
                    <View style={styles.statsHeaderContainer}>
                        <SecondaryText styles={styles.statsText}>Avg</SecondaryText>
                    </View>
                    <SecondaryText styles={styles.itemText} bold>{renderAvg(renderStatValues())} {renderLabel()}</SecondaryText>
                </View>
                <View style={styles.statsItemConatiner}>
                    <View style={styles.statsHeaderContainer}>
                        <SecondaryText styles={styles.statsText}>Max</SecondaryText>
                    </View>
                    <SecondaryText styles={styles.itemText} bold>{renderMax(renderStatValues())} {renderLabel()}</SecondaryText>
                </View>
            </ScrollView>
            <SecondaryText styles={styles.label}>{renderLabel()}</SecondaryText>
            <ExerciseChart data={renderChartValues()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: StyleConstants.baseMargin,
        backgroundColor: BaseColors.white,
        paddingTop: StyleConstants.baseMargin,
        paddingBottom: StyleConstants.baseMargin,
    },
    measContainer: {
        backgroundColor: BaseColors.primary,
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 100,
    },
    measText: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.white
    },
    label: {
        marginLeft: StyleConstants.baseMargin,
        color: BaseColors.secondary,
        fontSize: 12
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: StyleConstants.smallMargin,
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
    },
    headerText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    },
    statsContainer: {
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
        marginBottom: StyleConstants.smallMargin,
    },
    statsItemConatiner: {
        padding: StyleConstants.smallMargin,
        backgroundColor: BaseColors.white,
        borderRadius: StyleConstants.borderRadius,
        margin: 5,
        marginRight: StyleConstants.smallMargin,
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
        ...BaseColors.lightBoxShadow,
    },
    itemText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        alignSelf: 'center'
    },
    svgMin: {
        width: normalize.width(25),
        height: normalize.width(25),
        alignSelf: 'center',
        transform: [{ rotate: '-90deg' }]
    },
    svg: {
        height: normalize.width(25),
        justifyContent: 'center'
    },
    svgAvg: {
        width: normalize.width(25),
        height: 2,
        backgroundColor: BaseColors.primary,
        borderRadius: 5,
        alignSelf: 'center'
    },
    statsHeaderContainer: {
        marginRight: 5,
        marginLeft: 5,
        marginBottom: 5,
    },
    svgMax: {
        width: normalize.width(25),
        height: normalize.width(25),
        alignSelf: 'center',
        transform: [{ rotate: '90deg' }]
    },
    statsText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightBlack,
    }
})
export default DataOverviewItem;
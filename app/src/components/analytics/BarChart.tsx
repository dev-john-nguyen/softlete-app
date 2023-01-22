import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';
import { normalize } from '../../utils/tools';
import DateTools from '../../utils/DateTools';
import { BarChart } from 'react-native-chart-kit';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import { AnalyticsFilters } from './types';
import SecondaryText from '../elements/SecondaryText';

interface Props {
    data: any; //data props [[date, stats]]
    filter: AnalyticsFilters;
}


const AnalyticsBarChart = ({ data, filter }: Props) => {
    const [items, setItems] = useState([]);
    const [labels, setLabels] = useState([])

    const renderDate = (dStr: string) => {
        const date = DateTools.strToDate(dStr);
        if (!date) return;
        return (date.getMonth() + 1) + '/' + date.getDate()
    }

    useEffect(() => {

        const lastData = data.slice(data.length - 5, data.length)
        const labelss = lastData.map((d: any) => renderDate(d[0]))
        const itemss = lastData.map((d: any) => {
            switch (filter) {
                case AnalyticsFilters.LOW:
                    return d[1].min
                case AnalyticsFilters.HIGH:
                    return d[1].max
                case AnalyticsFilters.AVG:
                default:
                    return d[1].avg
            }
        })

        setItems(itemss)
        setLabels(labelss)

    }, [data, filter])

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SecondaryText styles={styles.headerText} bold>5 Most Recent</SecondaryText>
            </View>
            <BarChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: items
                        }
                    ]
                }}
                width={normalize.width(1)}
                height={normalize.height(2)}
                yAxisLabel=""
                yAxisSuffix=''
                chartConfig={{
                    backgroundGradientFrom: BaseColors.lightWhite,
                    backgroundGradientTo: BaseColors.lightWhite,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(${BaseColors.primaryRgb}, ${opacity})`,
                    labelColor: (opacity = 1) => BaseColors.primary,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "5",
                        strokeWidth: "1",
                        stroke: BaseColors.lightGrey
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
    },
    headerContainer: {
        padding: StyleConstants.baseMargin,
    },
    headerText: {
        color: BaseColors.black,
        fontSize: StyleConstants.mediumFont,
        textAlign: 'center'
    },
})

export default AnalyticsBarChart;

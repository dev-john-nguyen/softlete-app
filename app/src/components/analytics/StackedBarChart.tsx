import React, { useEffect, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseColors, { rgba } from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';
import Empty from './Empty';
import { AnalyticDataProps } from './types';


type GroupedChartProps = {
    data: AnalyticDataProps
    largestNum: number
}

const colors = {
    avg: rgba(BaseColors.whiteRbg, .4),
    min: rgba(BaseColors.whiteRbg, .2),
    max: rgba(BaseColors.whiteRbg, .6)
}

const GroupedChart = ({ data, largestNum }: GroupedChartProps) => {
    const [width, setWidth] = useState({ min: 0, avg: 0, max: 0 });

    useEffect(() => {
        const getWidth = (num: number) => {
            const r = Math.round((num / largestNum) * 100)
            return r
        }

        setWidth({
            min: getWidth(data.min),
            avg: getWidth(data.avg),
            max: getWidth(data.max)
        })
    }, [data, largestNum])


    const getStyles = (num: number, color: string) => {
        return {
            width: `${num}%`,
            height: 15,
            backgroundColor: color,
            positon: 'relative',
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            justifyContent: 'center'
        } as StyleProp<ViewStyle>
    }

    return (
        <View style={{ marginTop: StyleConstants.smallMargin, marginBottom: StyleConstants.smallMargin }}>
            <View style={{ width: '90%' }}>
                <View
                    style={getStyles(width.min, colors.min)}
                >
                    <PrimaryText
                        styles={styles.label}
                    >{data.min}</PrimaryText>
                </View>
                <View
                    style={getStyles(width.avg, colors.avg)}
                >
                    <PrimaryText
                        styles={styles.label}
                    >{data.avg}</PrimaryText>
                </View>
                <View
                    style={getStyles(width.max, colors.max)}
                >
                    <PrimaryText
                        styles={styles.label}
                    >{data.max}</PrimaryText>
                </View>
            </View>
        </View >
    )
}


type StackedBarChartProps = {
    data: AnalyticDataProps[];
}

/*
find the largest number

*/

const StackedBarChart = ({ data }: StackedBarChartProps) => {
    const [largestNum, setLargestNum] = useState(0);

    useEffect(() => {
        let largest = 0;
        data.forEach(stats => {
            if (stats.max > largest) {
                largest = stats.max
            }
        })
        setLargestNum(largest)
    }, [data])

    return (
        <View style={styles.container}>
            {
                data.length > 0 ?
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                {data.map(({ date }, i) => (
                                    <View style={{ height: 3 * 15, marginBottom: StyleConstants.smallMargin, marginTop: StyleConstants.smallMargin, justifyContent: 'center', marginRight: 5 }} key={date.getTime()}>
                                        <PrimaryText styles={{
                                            fontSize: StyleConstants.extraSmallFont
                                        }}>{(date.getMonth() + 1) + '/' + date.getDate()}</PrimaryText>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.listContainer}>
                                {data.map((d) => <GroupedChart key={d.date.getTime()} data={d} largestNum={largestNum} />)}
                            </View>
                        </View>
                    </ScrollView >
                    :
                    <Empty />
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: StyleConstants.baseMargin
    },
    listContainer: {
        borderLeftWidth: 1,
        borderLeftColor: rgba(BaseColors.whiteRbg, .5),
        width: '90%',
    },
    label: {
        position: 'absolute', right: -35, fontSize: StyleConstants.extraSmallFont
    }
})

export default StackedBarChart;
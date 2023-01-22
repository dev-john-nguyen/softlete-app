import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AnalyticsProps } from '../../services/misc/types';
import BaseColors, { rgba } from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';
import Empty from './Empty';


interface Props {
    data: AnalyticsProps['data']
}

const { strToDate, dateToStr } = DateTools;


const renderDate = (d: string) => {
    const date = strToDate(d)
    return (date.getMonth() + 1) + '/' + date.getDate()
}


const DataTable = ({ data }: Props) => {

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: normalize.height(20) }}>
            {
                data.length > 0 ?
                    <>
                        <View style={styles.headerContainer}>
                            <PrimaryText styles={[styles.hd, { flex: .5 }]}>DATE</PrimaryText>
                            <PrimaryText styles={[styles.hd, { flex: .5 }]}>SET</PrimaryText>
                            <PrimaryText styles={[styles.hd, { flex: .5 }]}>REP</PrimaryText>
                            <PrimaryText styles={styles.hd}>WEIGHT</PrimaryText>
                        </View>
                        {
                            data.map((d, i) => (
                                <View key={d.workoutExerciseUid}>
                                    {
                                        d.data.map(({ performVal, reps, _id }, i) => (
                                            <View style={[styles.tr, { backgroundColor: i % 2 === 0 ? rgba(BaseColors.whiteRbg, .2) : 'transparent' }]} key={_id || i}>
                                                <SecondaryText styles={[styles.cell, { opacity: i === 0 ? 1 : 0, flex: .5 }]}>{renderDate(d.date)}</SecondaryText>
                                                <SecondaryText styles={[styles.cell, { flex: .5 }]}>{i + 1}</SecondaryText>
                                                <SecondaryText styles={[styles.cell, { flex: .5 }]}>{reps}</SecondaryText>
                                                <SecondaryText styles={styles.cell}>{performVal}</SecondaryText>
                                            </View>
                                        ))
                                    }
                                </View>
                            ))
                        }

                    </> : <Empty />
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: StyleConstants.baseMargin
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        opacity: .6,
        padding: 10
    },
    hd: {
        flex: 1,
        fontSize: StyleConstants.extraSmallFont
    },
    tr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        padding: 10
    },
    cell: {
        flex: 1,
        fontSize: StyleConstants.smallFont
    }
})
export default DataTable;
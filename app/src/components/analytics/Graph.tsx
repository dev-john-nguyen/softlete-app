import React from 'react';
import { View, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import _ from 'lodash';
import { normalize } from '../../utils/tools';
import CustomLineChart from './LineChart';
import Empty from './Empty';

interface Props {
    data: any;
    dates: Date[];
}


const AnalyticsGraph = ({ dates, data }: Props) => {
    return (
        <View style={styles.container}>
            {
                data.length > 0 ? <CustomLineChart
                    data={data}
                    dates={dates}
                /> : <Empty />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
        flex: 1
    },
    headerContainer: {
        padding: StyleConstants.baseMargin,
    },
    headerText: {
        fontSize: StyleConstants.mediumFont,
        textAlign: 'center',
        color: BaseColors.white
    },
    headerSubText: {
        color: BaseColors.black,
        fontSize: StyleConstants.smallFont
    },
    progressContainer: {
        marginTop: normalize.height(14),
        height: normalize.height(2.5),
        marginBottom: StyleConstants.largeMargin,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.white
    }
})

export default AnalyticsGraph;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnalyticsProps, ExercisesAnalyticsProps } from '../../services/misc/types';
import BaseColors from '../../utils/BaseColors';
import Constants from '../../utils/Constants';
import HealthProgressItem from '../home/components/HealthItem';
import { moderateScale } from '../tools/StyleConstants';



interface Props {
    analytics?: AnalyticsProps
}


const renderShortMeasLabel = (meas?: string) => {
    if (!meas) return 'n/a';
    const shortLabel = Constants.longToShortMeasurments[meas];
    return shortLabel || 'n/a'
}

const HealthProgress = ({ analytics }: Props) => {

    return (
        <View style={styles.container}>
            <HealthProgressItem
                name='Minimum'
                value={analytics?.analytics?.min.toString() || '0'}
                label={renderShortMeasLabel(analytics?.exercise?.measSubCat)}
                progress={.05}
                progressColor={BaseColors.green}
                index={0}
                small
            />
            <HealthProgressItem
                name='Average'
                value={analytics?.analytics?.avg.toString() || '0'}
                label={renderShortMeasLabel(analytics?.exercise?.measSubCat)}
                progress={.5}
                progressColor={BaseColors.green}
                index={0}
                small
            />
            <HealthProgressItem
                name='Maximum'
                value={analytics?.analytics?.max.toString() || '0'}
                label={renderShortMeasLabel(analytics?.exercise?.measSubCat)}
                progress={1}
                progressColor={BaseColors.green}
                index={0}
                small
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginTop: 10,
        paddingBottom: moderateScale(20)
    }
})
export default HealthProgress;
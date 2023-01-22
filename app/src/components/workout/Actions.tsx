import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../elements/Input';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import { AnalyticsFilterTypes, AnalyticsProps, MiscActionProps } from '../../services/misc/types';
import { WorkoutExerciseProps, WorkoutStatus } from '../../services/workout/types';
import DateTools from '../../utils/DateTools';


interface Props {
    calcRef: number;
    handleCalcRefToExercise: (num: number) => void;
    analyticsStore: AnalyticsProps[]
    exerciseProps: WorkoutExerciseProps | undefined;
    fetchExerciseAnalytics: MiscActionProps['fetchExerciseAnalytics'];
    status: WorkoutStatus;
    onInputFocus: (focus: boolean) => void;
}


const WorkoutActions = ({ calcRef, handleCalcRefToExercise, analyticsStore, exerciseProps, fetchExerciseAnalytics, status, onInputFocus }: Props) => {
    const [calcType, setCalcType] = useState<AnalyticsFilterTypes | 'none'>('none');
    const [listVals] = useState(['none', ...Object.values(AnalyticsFilterTypes)]);
    const [fromDate] = useState(DateTools.dateToStr(DateTools.getMonthPrevious(new Date(), 3)));
    const [toDate] = useState(DateTools.dateToStr(new Date()));

    const renderCalcValue = useCallback(() => {
        if (calcType !== 'none' && exerciseProps) {
            //fetch in analytics
            const analytics = analyticsStore.find(a => a.exerciseUid === exerciseProps.exerciseUid || a.exerciseUid === exerciseProps.exercise?._id);

            if (analytics) {
                handleCalcRefToExercise(analytics.analytics[calcType]);
            } else {
                ///fetch it
                const exerciseUid = exerciseProps.exercise ? exerciseProps.exercise._id : exerciseProps.exerciseUid;
                if (!exerciseUid) return;
                fetchExerciseAnalytics(fromDate, toDate, [exerciseUid])
                    .then((fetchedAnal) => {
                        if (fetchedAnal && fetchedAnal.length > 0) {
                            handleCalcRefToExercise(fetchedAnal[0].analytics[calcType]);
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }, [calcType])

    useEffect(() => {
        renderCalcValue()
    }, [calcType])

    const onCalcRefChangeText = (numStr: string) => {
        const newCalc = parseInt(numStr) ? parseInt(numStr) : 0;
        handleCalcRefToExercise(newCalc);
    }

    if (status !== WorkoutStatus.pending) return <></>

    return (
        <View style={styles.container}>
            <Input
                value={calcRef ? calcRef.toString() : ''}
                onChangeText={onCalcRefChangeText}
                placeholder='0'
                numbers={true}
                keyboardType='numeric'
                onFocus={() => onInputFocus(true)}
                onBlur={() => onInputFocus(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
        marginTop: StyleConstants.baseMargin,
        justifyContent: 'space-between',
    },
    input: {
        borderRadius: StyleConstants.borderRadius,
        backgroundColor: BaseColors.lightGrey,
        textAlign: 'center',
        minWidth: '20%'
    },
    calcText: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.white,
        textTransform: 'capitalize'
    },
    calcContainer: {
        backgroundColor: BaseColors.primary,
        padding: 10,
        marginRight: 10,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConstants.borderRadius
    }
})
export default WorkoutActions;
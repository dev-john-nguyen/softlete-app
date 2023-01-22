import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { normalize, strToFloat } from '../../../../utils/tools';
import BaseColors, { rgba } from '../../../../utils/BaseColors';
import StyleConstants from '../../../tools/StyleConstants';
import { WorkoutExerciseDataProps, WorkoutProps, WorkoutStatus } from '../../../../services/workout/types';
import ExerciseDataHeader from './Header';
import AddSet from './Add';
import { MeasSubCats } from '../../../../services/exercises/types';
import CalcRef from './CalcRef';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { DataKeys } from './types';
import SetData from './Set';
import RefreshSvg from '../../../../assets/RefreshSvg';

interface Props {
    data: WorkoutExerciseDataProps[];
    updateData: (data: WorkoutExerciseDataProps[]) => void;
    calcRef?: number;
    workout: WorkoutProps;
    measSubCat: MeasSubCats;
    athlete?: boolean;
    onCalcRefUpdate: (calc: string | number) => void;
    goToFirstItem: () => void;
    showGoBack: boolean;
}


const ExerciseData = ({ data, updateData, calcRef, workout, measSubCat, athlete, onCalcRefUpdate, goToFirstItem, showGoBack }: Props) => {
    const [editable, setEditable] = useState(true);
    const [keyboardShow, setKeyboardShow] = useState(false);
    const _kh = useSharedValue(normalize.height(5));

    useEffect(() => {
        setEditable(workout.status !== WorkoutStatus.completed);
    }, [workout])

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardShow(true)
        })

        const hideSub = Keyboard.addListener('keyboardWillHide', (e) => {
            setKeyboardShow(false)
        })

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: keyboardShow ? withTiming(_kh.value) : withTiming(0),
        }
    }, [keyboardShow])

    const onCircleCheckPress = (item: WorkoutExerciseDataProps, index: number) => {
        if (athlete) return;

        const { completed, performVal, predictVal } = item;

        data[index] = {
            ...item,
            completed: completed ? false : true,
            performVal: !completed ? performVal ? performVal : predictVal : 0
        }

        updateData([...data])
    }

    const onAddSet = () => {
        //check length of data
        if (athlete) return;

        if (data.length >= 50) return;

        const lastItem = data[data.length - 1];

        if (lastItem) {
            updateData([...data, {
                predictVal: lastItem.predictVal,
                reps: lastItem.reps,
                pct: 100
            }])
        } else {
            updateData([...data, {
                predictVal: 0,
                reps: 1,
                pct: 100
            }])
        }
    }

    const onChangeText = (item: WorkoutExerciseDataProps, index: number, key: DataKeys, val: string) => {
        if (athlete) return;

        let numVal = parseInt(val);
        let predictedVal;

        if (key === DataKeys.pct) {
            //cannot be greater than 100
            if (numVal > 100) {
                numVal = 100
            }

            if (calcRef) {
                let val = (numVal / 100) * calcRef;
                predictedVal = parseFloat(val.toFixed(2))
            }
        }

        data[index] = {
            ...item,
            [key]: numVal ? numVal : 0
        }

        if (predictedVal) {
            data[index].predictVal = predictedVal
        }

        updateData(data)
    }

    const onRemoveSet = (index: number) => {
        if (athlete) return;
        if (data[index]) {
            data.splice(index, 1)
            updateData([...data])
        }
    }

    const renderPInput = (item: WorkoutExerciseDataProps) => {
        //if completed, show perform val
        const { predictVal, performVal } = item;
        switch (workout.status) {
            case WorkoutStatus.completed:
                return {
                    placeholder: '0',
                    value: performVal ? performVal.toString() : "0"
                }
            case WorkoutStatus.inProgress:
                return {
                    placeholder: predictVal.toString(),
                    value: performVal ? performVal.toString() : ''
                }
            case WorkoutStatus.pending:
                return {
                    placeholder: '0',
                    value: predictVal.toString()
                }
            default:
                return {
                    placeholder: '0',
                    value: "0"
                }
        }
    }

    const onChangePText = (item: WorkoutExerciseDataProps, index: number, key: DataKeys, val: string) => {
        if (athlete) return;

        let numVal = strToFloat(val);

        data[index] = {
            ...item,
            [key]: numVal ? numVal : 0
        }

        updateData(data)
    }

    const onWarmUpPress = (index: number) => {
        //set all the items before the pressed as warm up
        if (athlete || workout.status === WorkoutStatus.completed) return;
        //check if the user double tap the last warm up
        let removeAll = false;
        for (let i = 0; i < data.length; i++) {
            if (i <= index) {
                if (i === index && data[i].warmup) {
                    removeAll = true
                    break;
                } else {
                    data[i].warmup = true;
                }
            } else {
                data[i].warmup = false;
            }
        }

        if (removeAll) {
            data.forEach(d => {
                d.warmup = false;
            })
        }

        updateData([...data])
    }

    const renderData = () => {
        let warmupCom = false;
        let noWarmUp = false;

        return data.map((item, index) => {
            const { placeholder, value } = renderPInput(item);

            const dataKey = workout.status === WorkoutStatus.inProgress ? DataKeys.performVal : DataKeys.predictVal;
            let showWarmUp = false;

            if (index === 0 && !item.warmup) {
                noWarmUp = true
            }

            if (!item.warmup && !warmupCom && !noWarmUp) {
                warmupCom = true;
                showWarmUp = true;
            }

            return <SetData
                key={item._id ? item._id : index}
                showWarmUp={warmupCom && showWarmUp}
                editable={editable}
                onRemoveSet={onRemoveSet}
                onWarmUpPress={onWarmUpPress}
                index={index}
                item={item}
                onChangeText={onChangeText}
                onChangePText={onChangePText}
                placeholder={placeholder}
                value={value}
                athlete={athlete}
                onCircleCheckPress={onCircleCheckPress}
                status={workout.status}
                dataKey={dataKey}
            />
        })
    }


    return (
        <Pressable onPress={() => Keyboard.dismiss()}>
            {
                !athlete && <View style={styles.headerContainer}>
                    {showGoBack && (
                        <Pressable onPress={goToFirstItem} style={styles.refreshSvg}>
                            <RefreshSvg fillColor={rgba(BaseColors.lightWhiteRgb, .5)} />
                        </Pressable>
                    )}
                    <View style={{ flex: 1 }}>
                        {workout.status === WorkoutStatus.pending && !athlete && <CalcRef calcRef={calcRef} onCalcRefUpdate={onCalcRefUpdate} />}
                    </View>
                </View>
            }
            <ExerciseDataHeader status={workout.status} measSubCat={measSubCat} athlete={athlete} />
            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={styles.contentContainerStyle}
                keyboardShouldPersistTaps="always"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {renderData()}
                {
                    !athlete && <AddSet
                        onPress={onAddSet}
                        text={(data.length + 1).toString()}
                        editable={editable}
                    />
                }
                <Animated.View style={animatedStyles} />
            </ScrollView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: normalize.height(5),
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: StyleConstants.smallMargin,
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
    },
    refreshSvg: {
        width: normalize.width(15),
        height: normalize.width(15),
        alignSelf: 'center',
    },
    dataContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: StyleConstants.smallMargin
    },
    input: {
        width: '100%',
        textAlign: 'center'
    },
    circleCheck: {
        width: normalize.width(10),
        height: normalize.width(10)
    },
    percent: {
        position: 'absolute',
        right: '0%',
        top: '0%',
        zIndex: 100000,
        color: BaseColors.secondary,
        fontSize: StyleConstants.smallMediumFont
    },
    kb: {
        flex: .4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5
    }
})
export default ExerciseData;
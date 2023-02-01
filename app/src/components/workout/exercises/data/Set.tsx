import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WorkoutExerciseDataProps, WorkoutStatus } from '../../../../services/workout/types';
import BaseColors, { rgba } from '../../../../utils/BaseColors';
import { normalize } from '../../../../utils/tools';
import StyleConstants from '../../../tools/StyleConstants';
import CircleCheck from '../../../elements/CircleCheck';
import Input from '../../../elements/Input';
import PrimaryText from '../../../elements/PrimaryText';
import SecondaryText from '../../../elements/SecondaryText';
import { DataKeys } from './types';


interface Props {
    showWarmUp: boolean;
    editable: boolean;
    onRemoveSet: (index: number) => void;
    onWarmUpPress: (index: number) => void;
    index: number;
    item: WorkoutExerciseDataProps;
    onChangeText: (item: WorkoutExerciseDataProps, index: number, key: DataKeys, val: string) => void;
    onChangePText: (item: WorkoutExerciseDataProps, index: number, key: DataKeys, val: string) => void;
    placeholder: string;
    value: string;
    athlete?: boolean;
    onCircleCheckPress: (item: WorkoutExerciseDataProps, index: number) => void;
    status: string;
    dataKey: DataKeys
}


const SetData = ({ showWarmUp, editable, onWarmUpPress, onRemoveSet, index, item, onChangeText, onChangePText, placeholder, value, athlete, onCircleCheckPress, status, dataKey }: Props) => {
    return (
        <View style={{ flex: 1, width: '100%' }}>
            {
                (showWarmUp) && (
                    <View style={{ width: '100%', marginBottom: StyleConstants.baseMargin, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: .5 }}>
                        <View style={{ height: 1, width: '30%', borderRadius: 100, backgroundColor: BaseColors.lightGrey }} />
                        <SecondaryText styles={{
                            fontSize: StyleConstants.extraSmallFont,
                            color: BaseColors.lightWhite
                        }}>End Warm Up</SecondaryText>
                        <View style={{ height: 1, width: '30%', borderRadius: 100, backgroundColor: BaseColors.lightGrey }} />
                    </View>
                )
            }
            <View style={styles.container}>
                <Pressable style={({ pressed }) => [styles.setsContainer, { backgroundColor: pressed ? rgba(BaseColors.lightWhiteRgb, .2) : 'transparent' }]} onLongPress={() => editable && onRemoveSet(index)} onPress={() => editable && onWarmUpPress(index)}>
                    <SecondaryText styles={styles.sets}>{(index + 1).toString()}</SecondaryText>
                </Pressable>

                <View style={{ flex: .5, alignItems: 'center', borderRadius: StyleConstants.borderRadius, marginRight: 5 }}>
                    <Input
                        value={item.reps.toString()}
                        onChangeText={(val) => onChangeText(item, index, DataKeys.reps, val)}
                        numbers={true}
                        styles={[styles.input, {
                            color: athlete ? BaseColors.black :
                                BaseColors.lightWhite
                        }]}
                        keyboardType='numeric'
                        editable={editable && !athlete}
                    />
                </View>

                <View style={{ flex: 1, alignItems: 'center', marginRight: 5, borderRadius: StyleConstants.borderRadius }}>
                    <Input
                        value={value}
                        onChangeText={(val) => onChangePText(item, index, dataKey, val)}
                        numbers={true}
                        styles={[styles.input, {
                            color: athlete ? BaseColors.black :
                                BaseColors.lightWhite
                        }]}
                        placeholder={placeholder}
                        keyboardType='numeric'
                        editable={editable && !athlete}
                    />
                </View>

                <View style={{ flex: .6, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        !athlete && status === WorkoutStatus.inProgress
                            ?
                            <View style={styles.circleCheck}>
                                <CircleCheck onPress={() => onCircleCheckPress(item, index)} checked={item.completed} />
                            </View>
                            : (
                                <>
                                    <Input
                                        value={item.pct ? item.pct.toString() : '0'}
                                        onChangeText={(val) => onChangeText(item, index, DataKeys.pct, val)}
                                        numbers={true}
                                        styles={[styles.input, {
                                            color: athlete ? BaseColors.black :
                                                BaseColors.lightWhite
                                        }]}
                                        keyboardType='numeric'
                                        editable={editable && !athlete}
                                    />
                                    <PrimaryText styles={styles.percent}>%</PrimaryText>
                                </>
                            )
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        color: BaseColors.lightWhite,
        fontSize: StyleConstants.smallMediumFont,
        opacity: .3
    },
    setsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .4,
        borderRadius: StyleConstants.borderRadius,
        borderWidth: 1,
        borderColor: rgba(BaseColors.whiteRbg, .8),
        marginRight: 5,
    },
    sets: {
        fontSize: StyleConstants.numFont,
        color: BaseColors.lightWhite
    }
})
export default SetData;
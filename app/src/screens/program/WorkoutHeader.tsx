import React, { useState, useEffect, useCallback } from 'react';
import Input from '../../components/elements/Input';
import { connect } from 'react-redux';
import BaseColors from '../../utils/BaseColors';
import PrimaryButton from '../../components/elements/PrimaryButton';
import { StyleSheet, View, Pressable, Keyboard } from 'react-native';
import { ReducerProps } from '../../services';
import SecondaryText from '../../components/elements/SecondaryText';
import { EditWorkoutProps, WorkoutTypes } from '../../services/workout/types';
import StyleConstants from '../../components/tools/StyleConstants';
import { capitalize, convertDaysToWeekObj, convertObjToDays, normalize, programWorkoutsArrToObj } from '../../utils/tools';
import { RootProgramProps, ProgramWorkoutHeaderProps, ProgramActionProps } from '../../services/program/types';
import { updateProgramWorkoutHeader } from '../../services/program/actions';
import { Picker } from '@react-native-picker/picker';
import CustomPicker from '../../components/elements/Picker';
import CalendarTodaySvg from '../../assets/CalendarToday';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements';
import PrimaryText from '../../components/elements/PrimaryText';
import Constants from '../../utils/Constants';
import { HealthActivity } from 'react-native-health';
import CategorySvg from '../../assets/CategorySvg';
import { renderHealthActivityName } from '../../utils/format';
import { ProgramStackScreens } from './types';

interface Props {
    route: any;
    navigation: any;
    workoutHeader: EditWorkoutProps;
    targetProgram: RootProgramProps['targetProgram'];
    updateProgramWorkoutHeader: ProgramActionProps['updateProgramWorkoutHeader'];
}

//calendar date format yyyy-mm-dd

const WorkoutHeader = ({ route, navigation, workoutHeader, targetProgram, updateProgramWorkoutHeader }: Props) => {
    const [type, setType] = useState<HealthActivity>(WorkoutTypes.TraditionalStrengthTraining)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [day, setDay] = useState(0);
    const [week, setWeek] = useState(0);
    const [weeks, setWeeks] = useState<string[]>([])
    const [error, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [picker, setPicker] = useState('');
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

    const init = useCallback(() => {
        if (workoutHeader) {
            setType(workoutHeader.type ? workoutHeader.type : WorkoutTypes.TraditionalStrengthTraining)
            setName(workoutHeader.name);
            setDescription(workoutHeader.description);
            if (workoutHeader.program && targetProgram && targetProgram.workouts) {
                const obj = programWorkoutsArrToObj(targetProgram.workouts);

                let daysObj = {
                    week: 0,
                    day: 0
                }

                if (workoutHeader.daysFromStart) {
                    daysObj = convertDaysToWeekObj(workoutHeader.daysFromStart)
                }

                let weekKeys: string[] = [];

                if (!route.params || !route.params.weeks) {
                    weekKeys = Object.keys(obj);
                    const foundKey = weekKeys.findIndex(w => parseInt(w) === daysObj.week);
                    if (foundKey < 0) {
                        weekKeys.push(daysObj.week.toString());
                        weekKeys.sort((a, b) => parseInt(b) - parseInt(a))
                    }
                } else {
                    weekKeys = route.params.weeks
                }

                setWeek(daysObj.week)
                setDay(daysObj.day)
                setWeeks(weekKeys)
            }
        } else {
            setName('');
            setDescription('');
        }
    }, [route, workoutHeader])

    useEffect(() => {
        init()
    }, [route, workoutHeader])

    const onContinuePress = () => {
        //check values
        if (loading) return;

        let errors = [];

        if (!name && type === WorkoutTypes.TraditionalStrengthTraining) {
            errors.push("Name required.")
        }

        if (!type) {
            errors.push('type is required.')
        }

        if (errors.length > 0) {
            return setErrors(errors)
        }

        setErrors([]);

        setLoading(true);
        //saving program workout

        if (!targetProgram._id) {
            setLoading(false);
            return setErrors(["Couldn't find the program id. Please refresh and try again."]);
        }

        const programWorkoutHeaderData: ProgramWorkoutHeaderProps = {
            type: type,
            name: type === WorkoutTypes.TraditionalStrengthTraining ? name ? name : WorkoutTypes.TraditionalStrengthTraining : type,
            description,
            _id: workoutHeader ? workoutHeader._id : '',
            isPrivate: false,
            daysFromStart: convertObjToDays(week, day),
            programTemplateUid: targetProgram._id
        }

        updateProgramWorkoutHeader(programWorkoutHeaderData)
            .then(() => {
                setLoading(false)
                navigation.navigate(ProgramStackScreens.ProgramWorkout, { goBackScreen: ProgramStackScreens.Program, isProgram: true })
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const renderPickerItems = useCallback(() => {
        switch (picker) {
            case 'type':
                return Object.values(WorkoutTypes).map(type => {
                    return <Picker.Item label={renderHealthActivityName(type)} value={type} key={type} />
                })
            case 'week':
                return weeks.map((_, i) => {
                    return <Picker.Item label={(i + 1).toString()} value={i} key={i} />
                })
            case 'day':
        }

        return new Array(7).fill({}).map((_, i) => {
            return <Picker.Item label={capitalize(Constants.daysOfWeek[i])} value={i} key={i} />
        })
    }, [picker])


    const getPickerValue = () => {
        switch (picker) {
            case 'type':
                return type
            case 'week':
                return week.toString();
            case 'day':
                return day.toString();
        }

        return ''
    }

    const onPickerChangeValue = (val: string) => {
        switch (picker) {
            case 'type':
                return setType(val as any)
            case 'week':
                return setWeek(parseInt(val))
            case 'day':
                return setDay(parseInt(val))
        }
    }


    return (
        <Pressable style={{ flex: 1, paddingTop: headerHeight, paddingLeft: insets.left, paddingRight: insets.right }} onPress={() => Keyboard.dismiss()}>
            <View style={[styles.container, { paddingBottom: insets.bottom }]}>
                <View>
                    <PrimaryText styles={styles.headerText}>Workout Details</PrimaryText>
                    <SecondaryText styles={styles.headerSubText}>Fill out the form below.</SecondaryText>

                    <View style={styles.errorContainer}>
                        {error.map((e) => (
                            <SecondaryText key={Math.random()} styles={styles.errorText}>*{e}</SecondaryText>
                        ))}
                    </View>

                    <SecondaryText styles={styles.label}>Type</SecondaryText>
                    <Pressable style={styles.programContainer} onPress={() => setPicker(p => p ? '' : 'type')}>
                        <View style={styles.programSvg}>
                            <CategorySvg fillColor={BaseColors.primary} />
                        </View>
                        <SecondaryText styles={styles.text}>{renderHealthActivityName(type)}</SecondaryText>
                    </Pressable>

                    {
                        type === WorkoutTypes.TraditionalStrengthTraining && (
                            <>
                                <SecondaryText styles={styles.label}>Name</SecondaryText>
                                <Input
                                    value={name}
                                    placeholder='Name'
                                    autoCapitalize='words'
                                    onChangeText={(txt) => setName(txt)}
                                    styles={{ marginBottom: StyleConstants.smallMargin }}
                                    maxLength={50}
                                />
                            </>
                        )
                    }

                    <SecondaryText styles={styles.label}>Description</SecondaryText>
                    <Input
                        value={description}
                        placeholder='Description'
                        multiline={true}
                        onChangeText={(txt) => setDescription(txt)}
                        maxLength={100}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        blurOnSubmit
                        styles={{ marginBottom: StyleConstants.smallMargin }}
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginRight: StyleConstants.baseMargin }}>
                            <SecondaryText styles={styles.label}>Week</SecondaryText>
                            <Pressable style={styles.programContainer} onPress={() => setPicker(p => p ? '' : 'week')}>
                                <View style={styles.programSvg}>
                                    <CalendarTodaySvg fillColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.text}>{(week + 1)}</SecondaryText>
                            </Pressable>
                        </View>

                        <View>
                            <SecondaryText styles={styles.label}>Day</SecondaryText>
                            <Pressable style={styles.programContainer} onPress={() => setPicker(p => p ? '' : 'day')}>
                                <View style={styles.programSvg}>
                                    <CalendarTodaySvg fillColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.text}>{Constants.daysOfWeek[day]}</SecondaryText>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <PrimaryButton onPress={onContinuePress} styles={styles.button} loading={loading}>Done</PrimaryButton>
                <CustomPicker
                    open={!!picker ? true : false}
                    setOpen={() => setPicker('')}
                    value={getPickerValue()}
                    pickerItems={renderPickerItems()}
                    setValue={onPickerChangeValue}
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin
    },
    headerText: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary
    },
    headerSubText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    },
    errorText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.red,
        marginBottom: 2,
    },
    errorContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    dateInfo: {
        marginTop: StyleConstants.baseMargin,
        marginBottom: StyleConstants.baseMargin
    },
    label: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black,
        marginBottom: 10
    },
    date: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginLeft: 5
    },
    button: {
        marginTop: StyleConstants.baseMargin,
        marginBottom: StyleConstants.baseMargin
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginLeft: 5,
        textTransform: 'capitalize'
    },
    programContainer: {
        flexDirection: 'row', backgroundColor: BaseColors.white,
        padding: 15,
        borderRadius: StyleConstants.borderRadius,
        borderWidth: 1,
        borderColor: BaseColors.lightGrey,
        marginBottom: StyleConstants.smallMargin
    },
    programSvg: {
        width: normalize.width(20),
        height: normalize.width(20)
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    targetProgram: state.program.targetProgram,
    workoutHeader: state.program.workoutHeader
})

export default connect(mapStateToProps, { updateProgramWorkoutHeader })(WorkoutHeader);
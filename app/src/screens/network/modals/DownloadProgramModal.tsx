
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import CalendarThemeLight from "../../../components/calendar/CalendarThemeLight";
import { ReducerProps } from "../../../services";
import { generateProgram } from "../../../services/program/actions";
import { ProgramActionProps, ProgramProps } from "../../../services/program/types";
import DateTools from "../../../utils/DateTools";
import { Calendar, } from 'react-native-calendars';
import BaseColors from "../../../utils/BaseColors";
import StyleConstants from "../../../components/tools/StyleConstants";
import SecondaryText from "../../../components/elements/SecondaryText";
import PrimaryText from "../../../components/elements/PrimaryText";
import DownloadSvg from "../../../assets/DownloadSvg";
import { normalize } from "../../../utils/tools";
import Input from "../../../components/elements/Input";
import Loading from "../../../components/elements/Loading";
import { DateData } from "react-native-calendars/src/types";


interface Props {
    navigation: any;
    athleteProgramProps: ProgramProps;
    userProgramProps: ProgramProps;
    generateProgram: ProgramActionProps['generateProgram'];
    route: any;
}

function getNextSunday(d: Date) {
    return DateTools.dateToStr(DateTools.getStartOfNextWeek(d))
}


const DownloadProgramModal = ({ athleteProgramProps, userProgramProps, generateProgram, navigation, route }: Props) => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(getNextSunday(new Date()));
    const [sundays, setSundays] = useState({});
    const [errMsg, setErrMsg] = useState('');
    const [code, setCode] = useState('');
    const [program, setProgram] = useState<ProgramProps>();

    useEffect(() => {
        let d = new Date();
        getSundays([{
            dateString: DateTools.dateToStr(d),
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        } as DateData])
    }, [])

    useEffect(() => {
        setProgram(route.params?.athlete ? athleteProgramProps : userProgramProps);
    }, [athleteProgramProps, userProgramProps, route])

    const getSundays = (dateData: DateData[]) => {
        //start of the month
        const d = dateData[0];
        if (!d) return;
        var getTot = new Date(d.year, d.month, 0).getDate();
        let suns: any = {}
        for (var i = 1; i <= getTot; i++) {
            var newDate = new Date(d.year, d.month - 1, i)
            if (newDate.getDay() == 0) {
                suns[DateTools.dateToStr(newDate)] = { disabled: false }
            }
        }

        const firstKey = Object.keys(suns)[0];
        setDate(firstKey)
        setSundays(suns)
    }

    const onButtonSubmit = () => {
        if (loading) return;
        //validate that it's a sunday
        let d = DateTools.strToDate(date);
        if (!d || d.getDay() !== 0) {
            setErrMsg('*The start date must be on a sunday.');
            return;
        };
        setLSAccessCode()
        onGenerateProgram(date)
    }

    const onDayPress = (d: any) => {
        //validate if its sunday
        const date = new Date(d.year, d.month - 1, d.day);
        if (date.getDay() !== 0) return;
        setDate(d.dateString)
    }

    const setLSAccessCode = async () => {
        if (!program) return;

        const storageDir = `program-${program._id}-accessCode`
        //fetch access code if in storage
        const c = await AsyncStorage.getItem(storageDir)
            .then(c => c ? c : '')
            .catch(() => '')
        setCode(c)
    }


    const onGenerateProgram = async (d: string) => {
        if (loading) return;
        if (!program) return;
        setLoading(true);

        if (!program.workouts || program.workouts.length < 1) {
            setLoading(false)
            setErrMsg("*Cannot download an empty program.")
            return;
        }

        if (!DateTools.isValidDateStr(d)) return setLoading(false);

        await generateProgram(program._id, d, code)
            .then(() => {
                const storageDir = `program-${program._id}-accessCode`
                AsyncStorage.setItem(storageDir, code).catch(err => console.log(err))
                navigation.goBack()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    if (!program) return <Loading />

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <PrimaryText styles={styles.headerText}>{program.name}</PrimaryText>
                <SecondaryText styles={styles.headerSubText}>Please choose a sunday!</SecondaryText>
                <SecondaryText styles={styles.errorText} >{errMsg}</SecondaryText>
                <Calendar
                    disabledByDefault
                    theme={CalendarThemeLight}
                    markedDates={{
                        ...sundays,
                        [date]: { selected: true, selectedColor: BaseColors.primary }
                    }}
                    onDayPress={onDayPress}
                    onVisibleMonthsChange={getSundays}
                    monthFormat={'MMMM'}
                    style={{
                        marginBottom: StyleConstants.baseMargin
                    }}
                />
                {
                    program.isPrivate && route.params?.athlete && (
                        <View>
                            <SecondaryText styles={styles.label}>Access Code</SecondaryText>
                            <Input
                                placeholder='Retrieve access code from athlete.'
                                onChangeText={(txt) => setCode(txt)}
                                value={code}
                                multiline={true}
                                maxLength={100}
                            />
                        </View>
                    )
                }
                <Pressable onPress={onButtonSubmit} style={styles.generate}>
                    {loading ? <ActivityIndicator color={BaseColors.white} size='small' /> : <DownloadSvg color={BaseColors.white} />}
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: StyleConstants.baseMargin
    },
    headerText: {
        fontSize: StyleConstants.mediumLargeFont,
        color: BaseColors.primary,
        textTransform: 'capitalize',
    },
    headerSubText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginTop: 5
    },
    generate: {
        borderRadius: 100,
        height: normalize.width(8),
        width: normalize.width(8),
        padding: 15,
        backgroundColor: BaseColors.primary,
        alignSelf: 'center',
        marginTop: StyleConstants.baseMargin
    },
    label: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.lightBlack,
        marginBottom: 10
    },
    errorText: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.red,
        marginTop: StyleConstants.smallMargin,
        marginBottom: StyleConstants.smallMargin
    },
})

const mapStateToProps = (state: ReducerProps) => ({
    athleteProgramProps: state.athletes.targetProgram,
    userProgramProps: state.program.targetProgram
})


export default connect(mapStateToProps, { generateProgram })(DownloadProgramModal);
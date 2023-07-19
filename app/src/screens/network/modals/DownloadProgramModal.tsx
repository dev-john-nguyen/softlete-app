import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReducerProps } from '../../../services';
import { generateProgram } from '../../../services/program/actions';
import {
  ProgramActionProps,
  ProgramProps,
} from '../../../services/program/types';
import DateTools from '../../../utils/DateTools';
import { Calendar } from 'react-native-calendars';
import PrimaryText from '../../../components/elements/PrimaryText';
import Loading from '../../../components/elements/Loading';
import { DateData } from 'react-native-calendars/src/types';
import { PrimaryButton, ScreenTemplate } from '@app/elements';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';
import CalendarTheme from 'src/components/calendar/CalendarTheme';
import { Colors, rgba } from '@app/utils';
import CustomHeader from 'src/components/calendar/CustomHeader';

interface Props {
  navigation: any;
  athleteProgramProps: ProgramProps;
  userProgramProps: ProgramProps;
  generateProgram: ProgramActionProps['generateProgram'];
  route: any;
}

function getNextSunday(d: Date) {
  return DateTools.dateToStr(DateTools.getStartOfNextWeek(d));
}

const DownloadProgramModal = ({
  athleteProgramProps,
  userProgramProps,
  generateProgram,
  navigation,
  route,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(getNextSunday(new Date()));
  const [sundays, setSundays] = useState({});
  const [code, setCode] = useState('');
  const [program, setProgram] = useState<ProgramProps>();
  const setBanner = useBanner();

  useEffect(() => {
    const d = new Date();
    getSundays([
      {
        dateString: DateTools.dateToStr(d),
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      } as DateData,
    ]);
  }, []);

  useEffect(() => {
    setProgram(route.params?.athlete ? athleteProgramProps : userProgramProps);
  }, [athleteProgramProps, userProgramProps, route]);

  const getSundays = (dateData: DateData[]) => {
    //start of the month
    const d = dateData[0];
    if (!d) return;
    const getTot = new Date(d.year, d.month, 0).getDate();
    const suns: any = {};
    for (let i = 1; i <= getTot; i++) {
      const newDate = new Date(d.year, d.month - 1, i);
      if (newDate.getDay() == 0) {
        suns[DateTools.dateToStr(newDate)] = {
          disabled: false,
          customStyles: {
            text: {
              color: Colors.white,
            },
          },
        };
      }
    }

    const firstKey = Object.keys(suns)[0];
    setDate(firstKey);
    setSundays(suns);
  };

  const onButtonSubmit = () => {
    if (loading) return;
    //validate that it's a sunday
    const d = DateTools.strToDate(date);
    if (!d || d.getDay() !== 0) {
      return setBanner(
        'The start date must be on a sunday.',
        BannerTypes.warning,
      );
    }
    setLSAccessCode();
    onGenerateProgram(date);
  };

  const onDayPress = (d: any) => {
    //validate if its sunday
    const date = new Date(d.year, d.month - 1, d.day);
    if (date.getDay() !== 0) return;
    setDate(d.dateString);
  };

  const setLSAccessCode = async () => {
    if (!program) return;

    const storageDir = `program-${program._id}-accessCode`;
    // fetch access code if in storage
    const c = await AsyncStorage.getItem(storageDir)
      .then(c => (c ? c : ''))
      .catch(() => '');
    setCode(c);
  };

  const renderCustomHeader = (props: any) => {
    return (
      <CustomHeader
        monthProps={props.month}
        addMonth={props.addMonth}
        loading={false}
        offline={false}
      />
    );
  };

  const onGenerateProgram = async (d: string) => {
    if (loading) return;
    if (!program) return;
    setLoading(true);

    if (!program.workouts || program.workouts.length < 1) {
      setLoading(false);
      setBanner('Cannot download an empty program.', BannerTypes.warning);
      return;
    }

    if (!DateTools.isValidDateStr(d)) return setLoading(false);

    await generateProgram(program._id, d, code)
      .then(() => {
        const storageDir = `program-${program._id}-accessCode`;
        AsyncStorage.setItem(storageDir, code).catch(err => console.log(err));
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  if (!program) return <Loading />;

  return (
    <ScreenTemplate
      isBackVisible
      headerTitleFormatted="Generate Program"
      applyContentPadding>
      <PrimaryText marginBottom={20}>
        Choose a sunday to start your program.
      </PrimaryText>
      <Calendar
        theme={CalendarTheme({ dayTextColor: rgba(Colors.whiteRbg, 0.3) })}
        markingType="custom"
        hideArrows={false}
        markedDates={{
          ...sundays,
          [date]: { selected: true, selectedColor: Colors.white },
        }}
        onDayPress={onDayPress}
        onVisibleMonthsChange={getSundays}
        monthFormat={'MMMM'}
        customHeader={renderCustomHeader}
      />
      <PrimaryButton loading={loading} onPress={onButtonSubmit} marginTop={20}>
        Generate
      </PrimaryButton>
    </ScreenTemplate>
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  athleteProgramProps: state.athletes.targetProgram,
  userProgramProps: state.program.targetProgram,
});

export default connect(mapStateToProps, { generateProgram })(
  DownloadProgramModal,
);

import React, {useState, useEffect} from 'react';
import {StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import {Calendar, DateObject} from 'react-native-calendars';
import BaseColors, {rgba} from '../../utils/BaseColors';
import PrimaryButton from '../elements/PrimaryButton';
import DateTools from '../../utils/DateTools';
import StyleConstants from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import CalendarThemeLight from '../calendar/CalendarThemeLight';

interface Props {
  onClose: () => void;
  loading: boolean;
  onSubmit: (d: string) => void;
  showCal: boolean;
}

function getNextSunday(d: Date) {
  return DateTools.dateToStr(DateTools.getStartOfNextWeek(d));
}

const ProgramCalendarModal = ({onClose, onSubmit, loading, showCal}: Props) => {
  const [date, setDate] = useState(getNextSunday(new Date()));
  const [sundays, setSundays] = useState({});
  const [errMsg, setErrMsg] = useState('');

  const animatedStyles = useAnimatedStyle(() => {
    return {
      zIndex: showCal ? 100 : -1,
      opacity: withTiming(showCal ? 1 : 0, {
        easing: Easing.linear,
      }),
    };
  }, [showCal]);

  useEffect(() => {
    let d = new Date();
    getSundays({
      dateString: DateTools.dateToStr(d),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    } as DateObject);
  }, []);

  const onButtonSubmit = () => {
    //validate that it's a sunday
    let d = DateTools.strToDate(date);
    if (!d || d.getDay() !== 0) {
      setErrMsg('The start date must be on a sunday.');
      return;
    }

    onSubmit(date);
  };

  const onDayPress = (d: DateObject) => {
    //validate if its sunday
    const date = new Date(d.year, d.month - 1, d.day);
    if (date.getDay() !== 0) return;
    setDate(d.dateString);
  };

  const getSundays = (d: DateObject) => {
    //start of the month
    var getTot = new Date(d.year, d.month, 0).getDate();
    let suns: any = {};
    for (var i = 1; i <= getTot; i++) {
      var newDate = new Date(d.year, d.month - 1, i);
      if (newDate.getDay() == 0) {
        suns[DateTools.dateToStr(newDate)] = {disabled: false};
      }
    }

    setSundays(suns);
  };

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}>
        <Pressable style={[styles.content, BaseColors.primaryBoxShadow]}>
          <SecondaryText styles={styles.errMsg}>
            {!!errMsg && `*${errMsg}`}
          </SecondaryText>
          <Calendar
            disabledByDefault
            theme={CalendarThemeLight}
            markedDates={{
              ...sundays,
              [date]: {selected: true, selectedColor: BaseColors.primary},
            }}
            onDayPress={onDayPress}
            onMonthChange={getSundays}
            monthFormat={'MMMM'}
          />
          <PrimaryButton
            onPress={onButtonSubmit}
            styles={{marginTop: StyleConstants.smallMargin}}>
            {loading ? (
              <ActivityIndicator size="small" color={BaseColors.white} />
            ) : (
              `Generate`
            )}
          </PrimaryButton>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: rgba(BaseColors.lightWhiteRgb, 0.9),
  },
  content: {
    width: '90%',
    padding: 30,
    margin: 20,
    backgroundColor: BaseColors.white,
    borderRadius: 10,
  },
  errMsg: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.red,
  },
});
export default ProgramCalendarModal;

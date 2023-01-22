import { Colors, Fonts, normalize, rgba, StyleConstants } from '@app/utils';
import { Theme } from 'react-native-calendars/src/types';

export default {
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  textSectionTitleColor: Colors.primary,
  textSectionTitleDisabledColor: Colors.lightGrey,
  selectedDayBackgroundColor: Colors.white,
  selectedDayTextColor: Colors.primary,
  todayTextColor: Colors.primary,
  dayTextColor: Colors.lightWhite,
  textDisabledColor: rgba(Colors.whiteRbg, 0),
  dotColor: Colors.primary,
  selectedDotColor: Colors.primary,
  arrowColor: Colors.primary,
  disabledArrowColor: Colors.secondary,
  monthTextColor: Colors.primary,
  indicatorColor: Colors.primary,
  textDayFontFamily: Fonts.secondary,
  textMonthFontFamily: Fonts.primary,
  textDayHeaderFontFamily: Fonts.secondary,
  textDayFontSize: 16,
  textMonthFontSize: StyleConstants.mediumFont,
  textDayHeaderFontSize: 14,
  'stylesheet.calendar.header': {
    header: {
      marginBottom: 10,
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  'stylesheet.day.basic': {
    base: {
      width: normalize.width(11),
      height: normalize.width(11),
      alignItems: 'center',
      backgroundColor: Colors.lightPrimary,
      borderRadius: 10,
    },
    today: {
      width: normalize.width(11),
      height: normalize.width(11),
      alignItems: 'center',
      borderColor: rgba(Colors.whiteRbg, 0.6),
      borderWidth: 1,
      borderRadius: 10,
    },
    todayText: {
      color: Colors.lightWhite,
    },
    selected: {
      borderRadius: 10,
    },
  },
} as Theme;

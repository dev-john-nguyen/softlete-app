import { Theme } from "react-native-calendars/src/types";
import BaseColors, { rgba } from "../../utils/BaseColors";
import Fonts from "../../utils/Fonts";
import StyleConstants from "../tools/StyleConstants";

export default {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: BaseColors.lightBlack,
    textSectionTitleDisabledColor: '#c57f7f',
    selectedDayBackgroundColor: BaseColors.primary,
    selectedDayTextColor: BaseColors.white,
    todayTextColor: BaseColors.lightBlack,
    dayTextColor: BaseColors.primary,
    textDisabledColor: BaseColors.lightGrey,
    dotColor: BaseColors.primary,
    selectedDotColor: BaseColors.primary,
    arrowColor: BaseColors.black,
    disabledArrowColor: BaseColors.secondary,
    monthTextColor: BaseColors.black,
    indicatorColor: BaseColors.primary,
    textDayFontFamily: Fonts.secondary,
    textMonthFontFamily: Fonts.primary,
    textDayHeaderFontFamily: Fonts.secondary,
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
    textDayFontSize: StyleConstants.smallFont,
    textMonthFontSize: StyleConstants.smallMediumFont,
    textDayHeaderFontSize: StyleConstants.extraSmallFont,
} as Theme
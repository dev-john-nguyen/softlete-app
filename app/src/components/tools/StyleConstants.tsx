import { normalize } from '../../utils/tools';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: any) => (width / guidelineBaseWidth) * size;
// const verticalScale = size => height / guidelineBaseHeight * size;
export const moderateScale = (size: any, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default {
  baseMargin: moderateScale(15),
  largeMargin: moderateScale(25),
  smallMargin: moderateScale(10),
  smallPadding: moderateScale(10),
  extraSmallFont: moderateScale(11),
  smallerFont: moderateScale(13),
  smallFont: moderateScale(15),
  smallMediumFont: moderateScale(17),
  mediumFont: moderateScale(20),
  mediumLargeFont: moderateScale(25),
  largeFont: moderateScale(30),
  numFont: normalize.width(15),
  fontSize: {
    large: 22,
    medium: 18,
    small: 16,
  },
  borderRadius: 10,
} as any;

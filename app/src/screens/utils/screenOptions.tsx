import Fonts from '../../utils/Fonts';
import BaseColors from '../../utils/BaseColors';
import { moderateScale } from '../../components/tools/StyleConstants';

export default (parentProps: any, childProps: any) => {
  return {
    headerBackTitleVisible: false,
    headerTitle: '',
    headerRight: undefined,
    headerTitleStyle: {
      fontFamily: Fonts.primary,
      color: BaseColors.lightWhite,
      fontSize: moderateScale(18),
      textTransform: 'capitalize',
    },
    headerTransparent: true,
    headerLeft: () => null,
  } as any;
};

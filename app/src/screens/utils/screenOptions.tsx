import Fonts from '../../utils/Fonts';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../../components/tools/StyleConstants';
import { HomeStackScreens } from '../home/types';

export default (parentProps: any, childProps: any) => {
  let rotateBack = '0';
  let backColor = BaseColors.white;

  switch (childProps.route.name) {
    case HomeStackScreens.Health:
    case HomeStackScreens.Calendar:
      rotateBack = '90';
      break;
    case HomeStackScreens.Map:
      backColor = BaseColors.primary;
  }

  return {
    headerBackTitleVisible: false,
    headerTitle: '',
    headerRight: undefined,
    headerTitleStyle: {
      fontFamily: Fonts.primary,
      color: BaseColors.lightWhite,
      fontSize: StyleConstants.smallerFont,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    headerTransparent: true,
    headerLeft: () => null,
  } as any;
};

import {
  useRoute,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { HomeStackScreens } from '../../types';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

const getTargetProgram = (state: ReducerProps) => state.program.targetProgram;

export const useGoBack = () => {
  const targetProgram = useSelector(getTargetProgram);
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const navigationState = useNavigationState(state => state);

  const onGoBackHandler = () => {
    const routes = navigationState.routes;
    // Don't allow go back to workout header
    if (routes[routes.length - 2]?.name === HomeStackScreens.WorkoutHeader) {
      return navigation.navigate(HomeStackScreens.Home);
    }

    if (route.params?.goBackScreen) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { workouts, ...rest } = targetProgram;
      navigation.navigate(route.params.goBackScreen, {
        program: rest,
      });
      return;
    }

    if (route.params?.directToDash) {
      navigation.navigate(HomeStackScreens.Home, {
        directToDash: true,
      });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(HomeStackScreens.Home);
    }
  };

  return {
    onGoBackHandler,
  };
};

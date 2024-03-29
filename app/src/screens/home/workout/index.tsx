import React from 'react';
import { ReducerProps } from '../../../services';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { useSelector } from 'react-redux';
import { HomeStackScreens } from '.././types';
import Loading from '../../../components/elements/Loading';
import ScreenTemplate from '../../../components/elements/screen-template';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { FlexBox } from '@app/ui';
import { DemoArrow } from '@app/elements';
import { DemoStates } from '@app/services';
import WorkoutContainer from './components/WorkoutContainer';
import { WorkoutContextProvider } from './contexts';

const Workout = () => {
  const { workout, targetProgram } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
    targetProgram: state.program.targetProgram,
  }));

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const navigationState = useNavigationState(state => state);

  const onBackButtonPress = () => {
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

  if (!workout) {
    return <Loading />;
  }

  return (
    <WorkoutContextProvider>
      <ScreenTemplate
        isBackVisible
        applyContentPadding
        onGoBack={onBackButtonPress}
        rightContentFlex={0.4}
        rightContent={
          <FlexBox
            flex={1}
            width="auto"
            alignItems="center"
            justifyContent="flex-end">
            <DemoArrow state={[DemoStates.WORKOUT_VIEW_MENU]} />
            <Icon
              icon="notebook"
              size={25}
              color={Colors.white}
              onPress={() =>
                navigation.navigate(HomeStackScreens.WorkoutReflectionModal)
              }
            />
            <Icon
              icon="timer"
              size={25}
              color={Colors.white}
              onPress={() => navigation.navigate(HomeStackScreens.Timer)}
              containerStyles={{ marginLeft: 10 }}
            />
            <Icon
              icon="ellipsis"
              size={20}
              color={Colors.white}
              onPress={() => navigation.navigate(HomeStackScreens.WorkoutModal)}
              containerStyles={{ marginLeft: 10 }}
            />
          </FlexBox>
        }>
        <WorkoutContainer />
      </ScreenTemplate>
    </WorkoutContextProvider>
  );
};

export default Workout;

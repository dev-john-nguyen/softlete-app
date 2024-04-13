import React from 'react';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { HomeStackScreens } from '../../types';
import ScreenTemplate from '../../../../components/elements/screen-template';
import { useNavigation } from '@react-navigation/native';
import { FlexBox } from '@app/ui';
import { DemoArrow } from '@app/elements';
import { DemoStates } from '@app/services';
import WorkoutContainer from '../components/WorkoutContainer';
import { WorkoutContextProvider } from '../contexts';
import { useFetchWorkout } from '../hooks/workout.hooks';
import { useGoBack } from '../hooks/general.hooks';
import WorkoutError from '../components/WorkoutError';
import WorkoutLoading from '../components/WorkoutLoading';
import WorkoutEmpty from '../components/WorkoutEmpty';

const Workout = () => {
  const navigation = useNavigation<any>();
  const { workout, isFetching, isError } = useFetchWorkout();
  const { onGoBackHandler } = useGoBack();

  if (isError) {
    return <WorkoutError />;
  }

  if (isFetching) {
    return <WorkoutLoading />;
  }

  if (!workout) {
    return <WorkoutEmpty />;
  }

  return (
    <WorkoutContextProvider workout={workout}>
      <ScreenTemplate
        isBackVisible
        onGoBack={onGoBackHandler}
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

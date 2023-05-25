import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import View from './Workout';
import WorkoutHeader from './WorkoutHeader';
import SearchExercises from '../exercises/Search';
import EditExercise from '../exercises/Edit';
import WorkoutExerciseRestructure from './ExerciseRestructure';
import Calendar from './Calendar';
import screenOptions from '../utils/screenOptions';
import ExerciseAnalytics from '../exercises/Analytics';
import Exercise from '../exercises/profile/Profile';
import BaseColors from '../../utils/BaseColors';
import { HomeStackParamsList, HomeStackScreens } from './types';
import WorkoutModal from './modals/WorkoutModal';
import GoOnlineModal from './modals/GoOnlineModal';
import UploadExerciseVideo from '../exercises/UploadVideo';
import DataOverview from './DataOverview';
import { Home } from './home';
import EditExerciseDetails from '../exercises/EditDetails';
import Subscribe from './Subscribe';
import Map from './Map';
import Health from './Health';
import DeviceActivities from './DeviceActivities';
import WorkoutActivitySummary from './WorkoutActivitySummary';
import { FlexBox } from '@app/ui';
import GoalForm from '../exercises/GoalForm';
import ExerciseGoal from '../exercises/exercise-goals/ExerciseGoals';
import { HealthGoalForm } from './health-goal';
import { EnduranceAnalytics } from './endurance';

const Tab = createStackNavigator<HomeStackParamsList>();

function HomeStack(parentProps: any) {
  return (
    <Tab.Navigator
      screenOptions={childProps => screenOptions(parentProps, childProps)}
      initialRouteName={HomeStackScreens.Home}>
      <Tab.Group>
        <Tab.Screen
          name={HomeStackScreens.Home}
          component={Home}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerRight: undefined,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.DeviceActivities}
          component={DeviceActivities}
          options={{
            headerTitle: '',
            headerRight: undefined,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureDirection: 'vertical',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.EnduranceAnalytics}
          component={EnduranceAnalytics}
          options={{
            headerTitle: '',
            headerRight: undefined,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureDirection: 'vertical',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.HealthGoalForm}
          component={HealthGoalForm}
          options={{
            headerTitle: '',
            headerRight: undefined,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureDirection: 'vertical',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Calendar}
          component={Calendar}
          options={{
            headerTitle: '',
            headerRight: undefined,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureDirection: 'vertical',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Health}
          component={Health}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureDirection: 'vertical',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Map}
          component={Map}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerRight: undefined,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Subscribe}
          component={Subscribe}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerRight: undefined,
            gestureEnabled: false,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.WorkoutHeader}
          component={WorkoutHeader}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.ExerciseAnalytics}
          component={ExerciseAnalytics}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            headerTintColor: BaseColors.white,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.DataOverview}
          component={DataOverview}
          options={{
            headerTitle: 'Overview',
            headerRight: undefined,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Workout}
          component={View}
          options={{
            gestureEnabled: false,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.SearchExercises}
          component={SearchExercises}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            headerTintColor: BaseColors.black,

            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.EditExerciseDetails}
          component={EditExerciseDetails}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.UploadExerciseVideo}
          component={UploadExerciseVideo}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.Exercise}
          component={Exercise}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            headerTintColor: BaseColors.black,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.GoalFormModal}
          component={GoalForm}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            presentation: 'modal',
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.ExerciseGoal}
          component={ExerciseGoal}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.ReorderWorkoutExercises}
          component={WorkoutExerciseRestructure}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTransparent: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.EditExercise}
          component={EditExercise}
          options={{
            headerTitle: '',
            headerRight: undefined,
            headerTintColor: BaseColors.black,
            headerTransparent: true,
          }}
        />

        <Tab.Screen
          name={HomeStackScreens.WorkoutActivitySummary}
          component={WorkoutActivitySummary}
          options={{}}
        />
      </Tab.Group>

      <Tab.Group
        screenOptions={{
          presentation: 'transparentModal',
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlay: () => {
            return <FlexBox flex={1} backgroundColor="red" />;
          },
        }}>
        <Tab.Screen
          name={HomeStackScreens.WorkoutModal}
          component={WorkoutModal}
          options={{
            title: '',
            headerRight: undefined,
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name={HomeStackScreens.GoOnlineModal}
          component={GoOnlineModal}
          options={{
            title: '',
            headerRight: undefined,
            headerTransparent: true,
            presentation: 'modal',
            gestureEnabled: false,
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
}

export default HomeStack;

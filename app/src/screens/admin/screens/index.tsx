import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminStackParamsList, AdminStackList } from './types';
import screenOptions from '../../utils/screenOptions';
import AdminEditExercise from '../components/EditExercise';
import AdminExercises from '../components/SearchExercises';
import UploadExerciseVideo from '../components/UploadExerciseVideo';
import AdminHome from './Home';
import BaseColors from '../../../utils/BaseColors';

const Tab = createStackNavigator<AdminStackParamsList>();

function AdminStack(parentProps: any) {
  return (
    <Tab.Navigator
      screenOptions={childProps => screenOptions(parentProps, childProps)}>
      <Tab.Screen
        name={AdminStackList.AdminHome}
        component={AdminHome}
        options={{
          title: '',
          headerLeft: () => null,
          headerTransparent: true,
        }}
      />
      <Tab.Screen
        name={AdminStackList.AdminEditExercise}
        component={AdminEditExercise}
        initialParams={{ admin: true, create: true }}
        options={{
          headerTitle: 'Admin',
          headerRight: undefined,
          headerTintColor: BaseColors.primary,
          headerTransparent: true,
        }}
      />
      <Tab.Screen
        name={AdminStackList.AdminExercises}
        component={AdminExercises}
        initialParams={{ admin: true }}
        options={{
          headerTitle: '',
          headerRight: undefined,
          headerTintColor: BaseColors.primary,
          headerTransparent: true,
          headerLeft: () => null,
        }}
      />
      <Tab.Screen
        name={AdminStackList.AdminUploadExerciseVideo}
        component={UploadExerciseVideo}
        initialParams={{ admin: true }}
        options={{
          headerTitle: 'Admin',
          headerRight: undefined,
          headerTintColor: BaseColors.primary,
          headerTransparent: true,
        }}
      />
    </Tab.Navigator>
  );
}

export default AdminStack;

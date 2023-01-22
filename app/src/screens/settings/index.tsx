import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from '../../screens/settings/EditProfile';
import Settings from '../../screens/settings/Settings';
import screenOptions from '../utils/screenOptions';
import { SettingsStackParamList } from './types';
import Subscription from './Subscription';
import ResetPassword from './ResetPassword';
import RemoveAccount from './RemoveAccount';
import FormInput from '../utils/FormInput';
import BugReport from './BugReport';
import Legal from './Legal';

const Tab = createStackNavigator<SettingsStackParamList>();

function SettingsStack(parentProps: any) {
  return (
    <Tab.Navigator
      screenOptions={childProps => screenOptions(parentProps, childProps)}>
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerLeft: () => null,
          headerTransparent: true,
          title: '',
        }}
      />

      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
          headerLeft: () => null,
        }}
      />

      <Tab.Screen
        name="FormInput"
        component={FormInput}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerLeft: () => null,
        }}
      />

      <Tab.Screen
        name="Subscription"
        component={Subscription}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
        }}
      />

      <Tab.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
        }}
      />

      <Tab.Screen
        name="RemoveAccount"
        component={RemoveAccount}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
        }}
      />

      <Tab.Screen
        name="BugReport"
        component={BugReport}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
        }}
      />

      <Tab.Screen
        name="Legal"
        component={Legal}
        options={{
          headerTitle: '',
          headerRight: () => null,
          headerTransparent: true,
        }}
      />
    </Tab.Navigator>
  );
}

export default SettingsStack;

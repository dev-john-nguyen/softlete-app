import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import screenOptions from '../utils/screenOptions';
import { HelpStackParamsList, HelpStackScreens } from './types';
import HelpMenu from './Menu';
import TipsAndAdvice from './TipsAndAdvice';

const Tab = createStackNavigator<HelpStackParamsList>();

function HelpStack(parentProps: any) {
    return (
        <Tab.Navigator screenOptions={(childProps) => screenOptions(parentProps, childProps)
        }>
            <Tab.Screen name={HelpStackScreens.HelpMenu} component={HelpMenu} options={{
                title: '',
                headerLeft: () => null,
                headerTransparent: true
            }} />
            <Tab.Screen name={HelpStackScreens.TipsAndAdvice} component={TipsAndAdvice} options={{
                title: '',
                headerTransparent: true
            }} />
        </Tab.Navigator>
    );
}

export default HelpStack;
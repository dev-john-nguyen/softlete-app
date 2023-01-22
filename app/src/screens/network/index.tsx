import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NetworkStackParamList, NetworkScreenTitles, NetworkStackScreens } from './types';
import screenOptions from '../utils/screenOptions';
import SearchAthletes from './Search';
import AthleteDashboard from './Dashboard';
import BaseColors from '../../utils/BaseColors';
import AthleteWorkout from './Workout';
import Exercise from '../exercises/View';
import AthleteAnalytics from '../exercises/Analytics';
import AthleteProgramTemplate from './ProgramTemplate';
import Message from './Message';
import Notifications from './Notifications';
import Chats from './Chats';
import Templates from './Templates';
import AthleteModal from './modals/AthleteModal';
import Friends from './Friends';
import DownloadProgramModal from './modals/DownloadProgramModal';
import OverviewModal from './modals/OverviewModal';
import AthleteSearchExercises from './SearchExercises';
import AthleteFriends from './AthleteFriends';
import Maintenance from './Maintenance';

const Tab = createStackNavigator<NetworkStackParamList>();

function NetworkStack(parentProps: any) {
    return (
        <Tab.Navigator
            screenOptions={(childProps) => screenOptions(parentProps, childProps)}
            initialRouteName={NetworkStackScreens.Maintenance}
        >

            <Tab.Screen name={NetworkStackScreens.Maintenance} component={Maintenance} options={{
                title: '',
                headerRight: undefined,
                headerTransparent: true,
                animationEnabled: false,
                headerLeft: () => null
            }} />

            <Tab.Group>
                <Tab.Screen name={NetworkStackScreens.SearchAthletes} component={SearchAthletes} options={{
                    title: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    animationEnabled: false,
                    headerLeft: () => null
                }} />

                <Tab.Screen name={NetworkStackScreens.Friends} component={Friends} options={{
                    title: 'Friends',
                    animationEnabled: false,
                    headerLeft: () => null
                }} />

                <Tab.Screen name={NetworkStackScreens.AthleteFriends} component={AthleteFriends} options={{
                    title: 'Friends',
                    headerRight: undefined
                }} />

                <Tab.Screen name={NetworkStackScreens.AthleteDashboard} component={AthleteDashboard} options={{
                    title: '',
                    headerStyle: {
                        shadowColor: 'transparent',
                        backgroundColor: BaseColors.lightWhite
                    },
                    headerRight: undefined,
                    headerTintColor: BaseColors.lightBlack
                }} />

                <Tab.Screen name={NetworkStackScreens.AthleteWorkout} component={AthleteWorkout} options={{
                    headerRight: undefined,
                    headerTintColor: BaseColors.black,
                    gestureEnabled: false,
                }} />

                <Tab.Screen name={NetworkStackScreens.AthleteExercise} component={Exercise} options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    headerTintColor: BaseColors.black
                }}
                    initialParams={{ athlete: true }}
                />

                <Tab.Screen name={NetworkStackScreens.AthleteSearchExercises} component={AthleteSearchExercises} options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    headerTintColor: BaseColors.black
                }}
                />

                <Tab.Screen name={NetworkStackScreens.AthleteAnalytics} component={AthleteAnalytics}
                    options={{
                        headerTitle: '',
                        headerRight: undefined,
                        headerTransparent: true,
                        headerTintColor: BaseColors.white
                    }}
                    initialParams={{ athlete: true }}
                />

                <Tab.Screen
                    name={NetworkStackScreens.AthleteProgramTemplate}
                    options={{
                        headerTitle: '',
                        headerRight: undefined,
                        headerTransparent: true,
                        headerTintColor: BaseColors.white
                    }}
                    component={AthleteProgramTemplate}
                />

                <Tab.Screen name={NetworkStackScreens.Chats} component={Chats}
                    options={{
                        title: 'Inbox',
                        animationEnabled: false,
                        headerLeft: () => null
                    }}
                />

                <Tab.Screen name={NetworkStackScreens.Message} component={Message}
                    options={{
                        headerRight: undefined,
                        title: '',
                        headerTintColor: BaseColors.black,
                        headerTransparent: true
                    }}

                />

                <Tab.Screen
                    name={NetworkStackScreens.Notifications}
                    component={Notifications}
                    options={{
                        title: 'Activity'
                    }}
                />

                <Tab.Screen
                    name={NetworkStackScreens.Templates}
                    options={{
                        headerTitle: "Templates",
                        headerLeft: () => null,
                        animationEnabled: false
                    }}
                    component={Templates}
                />

            </Tab.Group>

            <Tab.Group screenOptions={{ presentation: 'transparentModal' }}>
                <Tab.Screen name={NetworkStackScreens.AthleteModal} component={AthleteModal}
                    options={{
                        title: '',
                        headerRight: undefined,
                        headerTransparent: true,
                        headerLeft: () => null
                    }}
                />

                <Tab.Screen name={NetworkStackScreens.AthleteOverviewModal} component={OverviewModal}
                    options={{
                        title: '',
                        headerRight: undefined,
                        headerTransparent: true,
                        presentation: 'modal',
                        headerLeft: () => null
                    }}
                />

                <Tab.Screen name={NetworkStackScreens.DownloadProgramModal} component={DownloadProgramModal}
                    options={{
                        title: '',
                        headerRight: undefined,
                        headerTransparent: true,
                        presentation: 'modal',
                        headerLeft: () => null,
                    }}
                    initialParams={{ athlete: true }}
                />

            </Tab.Group>

        </Tab.Navigator>
    );
}

export default NetworkStack;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import screenOptions from '../utils/screenOptions';
import Templates from './Templates';
import { ProgramStackParamsList, ProgramStackScreens } from './types';
import SearchExercises from '../exercises/Search';
import EditExercise from '../exercises/Edit';
import Exercise from '../exercises/View';
import ExerciseAnalytics from '../exercises/Analytics';
import UploadExerciseVideo from '../exercises/UploadVideo';
import ProgramTemplate from './ProgramTemplate';
import WorkoutModal from './modal/WorkoutModal';
import Workout from './Workout';
import BaseColors from '../../utils/BaseColors';
import ProgramHeader from './ProgramHeader';
import WorkoutHeader from './WorkoutHeader';
import ProgramModal from './modal/ProgramModal';
import ProgramAccess from './ProgramAccess';
import ExerciseRestructure from './ExerciseRestructure';
import DownloadProgramModal from '../network/modals/DownloadProgramModal';
import EditExerciseDetails from '../exercises/EditDetails';
import FormInput from '../utils/FormInput';

const Tab = createStackNavigator<ProgramStackParamsList>();


function ProgramStack(parentProps: any) {
    return (
        <Tab.Navigator
            screenOptions={(childProps) => screenOptions(parentProps, childProps)}
            initialRouteName={ProgramStackScreens.Templates}>

            <Tab.Screen
                name={ProgramStackScreens.Templates}
                component={Templates}
                options={{
                    headerTitle: 'Programs',
                    headerLeft: () => null,
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.ProgramInput}
                component={FormInput}
                options={{
                    headerTitle: '',
                    headerRight: () => null,
                    headerLeft: () => null
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.Program}
                component={ProgramTemplate}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerRight: undefined,
                    headerTintColor: BaseColors.white
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.ProgramHeader}
                component={ProgramHeader}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerRight: undefined
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.ProgramExerciseAnalytics}
                component={ExerciseAnalytics}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerRight: undefined
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.ProgramReorderWorkoutExercises}
                component={ExerciseRestructure}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                }}
            />


            <Tab.Screen
                name={ProgramStackScreens.ProgramWorkout}
                component={Workout}
                options={{
                    headerTitle: '',
                    headerRight: undefined
                }}
            />

            <Tab.Screen
                name={ProgramStackScreens.ProgramWorkoutHeader}
                component={WorkoutHeader}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerRight: undefined
                }}
            />

            <Tab.Screen name={ProgramStackScreens.ProgramSearchExercises} component={SearchExercises}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true
                }}
                initialParams={{ programStack: true }}
            />

            <Tab.Screen name={ProgramStackScreens.ProgramAccess} component={ProgramAccess}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true
                }}
            />

            <Tab.Screen name={ProgramStackScreens.ProgramUploadVideo} component={UploadExerciseVideo}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true
                }}
                initialParams={{ programStack: true }}
            />

            <Tab.Screen name={ProgramStackScreens.ProgramEditExercise} component={EditExercise}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    headerTintColor: BaseColors.primary
                }}
                initialParams={{ programStack: true }}
            />


            <Tab.Screen name={ProgramStackScreens.ProgramExercise} component={Exercise}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    headerTintColor: BaseColors.primary
                }}
                initialParams={{ programStack: true }}
            />

            <Tab.Screen name={ProgramStackScreens.ProgramEditExerciseDetails} component={EditExerciseDetails}
                options={{
                    headerTitle: '',
                    headerRight: undefined,
                    headerTransparent: true,
                    headerTintColor: BaseColors.primary
                }}
                initialParams={{ programStack: true }}
            />


            <Tab.Group>
                <Tab.Screen
                    name={ProgramStackScreens.ProgramWorkoutModal}
                    component={WorkoutModal}
                    options={{
                        headerTitle: '',
                        headerTransparent: true,
                        headerLeft: () => null,
                        headerRight: undefined,
                        presentation: 'transparentModal',
                    }}
                />

                <Tab.Screen
                    name={ProgramStackScreens.ProgramDownload}
                    component={DownloadProgramModal}
                    options={{
                        title: '',
                        headerRight: undefined,
                        headerLeft: () => null,
                        headerTransparent: true,
                        presentation: 'modal'
                    }}
                />

                <Tab.Screen
                    name={ProgramStackScreens.ProgramModal}
                    component={ProgramModal}
                    options={{
                        headerTitle: '',
                        headerTransparent: true,
                        headerLeft: () => null,
                        headerRight: undefined,
                        presentation: 'transparentModal',
                    }}
                />
            </Tab.Group>

        </Tab.Navigator>
    )
}

export default ProgramStack;
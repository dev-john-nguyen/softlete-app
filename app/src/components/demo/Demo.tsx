import React, { useEffect, useState } from 'react';
import { StyleProp } from 'react-native';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import { HomeStackScreens } from '../../screens/home/types';
import { ReducerProps } from '../../services';
import { SET_DEMO_STATE } from '../../services/global/actionTypes';
import { DemoStates } from '../../services/global/types';
import DemoArrow from './DemoArrow';
import DemoModal from './DemoModal';


interface Props {
    demoState: DemoStates;
    screen: string;
    dispatch: AppDispatch;
}

const DashboardDemo = ({ demoState, screen, dispatch }: Props) => {
    const [headerText, setHeaderText] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [topPos, setTopPos] = useState('0%');
    const [nextDemo, setNextDemo] = useState('');
    const [chev, setChev] = useState<StyleProp<any>>({
        top: '-100%',
        right: '5%',
        transform: [{ rotate: '-180deg' }]
    });
    const [subBodyText, setSubBodyText] = useState('');
    const [backDemo, setBackDemo] = useState('');
    const [active, setActive] = useState(false);

    useEffect(() => {
        updateState()
    }, [demoState])

    useEffect(() => {
        //demo is not live so don't 
        if (!demoState) return setActive(false);

        //on mount dispatch the initial state of demo for the screen
        switch (screen) {
            case HomeStackScreens.Home:
                dispatch({ type: SET_DEMO_STATE, payload: DemoStates.HOME_WOS })
                break;
            case HomeStackScreens.WorkoutHeader:
                dispatch({ type: SET_DEMO_STATE, payload: DemoStates.WO_HEADER })
                break;
            case HomeStackScreens.Workout:
                dispatch({ type: SET_DEMO_STATE, payload: DemoStates.WO_ADD_EX })
                break;
            case HomeStackScreens.SearchExercises:
                dispatch({ type: SET_DEMO_STATE, payload: DemoStates.EX_SEARCH })
                break;
        }
    }, [screen])

    const updateState = () => {
        //demo is not live so don't 
        if (!demoState) return setActive(false);

        let hT = headerText
        let bT = bodyText
        let tP = topPos
        let nD = nextDemo
        let chevPos: StyleProp<any> = chev;
        let sBT = subBodyText;
        let bD = backDemo;

        switch (demoState) {
            case DemoStates.HOME_WOS:
                hT = "Today"
                bT = "All your workouts that you scheduled for today will be displayed here for quick and easy access."
                tP = '50%'
                nD = DemoStates.HOME_STATS;
                bD = DemoStates.HOME_WOS;
                chevPos = {
                    top: '25%',
                    left: '45%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = ''
                break;
            case DemoStates.HOME_STATS:
                hT = "Health"
                bT = "All the health data collected for today will be shown here. Use this information to gauge how you're doing today."
                sBT = "If you gave the app access to your device's health data then you will see more data like total calories burned throughout the day."
                tP = '10%'
                nD = DemoStates.HOME_EXERCISES;
                bD = DemoStates.HOME_WOS;
                chevPos = {
                    top: '50%',
                    left: '45%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.HOME_EXERCISES:
                hT = 'Exercises'
                bT = `When you pin an exercise it will appear below. A graph will appear to show you the progress you've made with the exercise.`
                tP = '30%';
                nD = DemoStates.CALENDAR;
                bD = DemoStates.HOME_STATS;
                chevPos = {
                    top: '75%',
                    left: '15%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = ''
                break
            case DemoStates.CALENDAR:
                hT = 'Calendar'
                bT = "Navigate to the calendar to organize your workouts."
                sBT = `Tip: Press and hold on a workout to copy. Press and hold on a date to paste.`
                tP = '35%'
                nD = DemoStates.LOCATE_STATS_NAV;
                bD = DemoStates.HOME_EXERCISES;
                chevPos = {
                    top: '20%',
                    left: '88%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.LOCATE_STATS_NAV:
                hT = "Health History"
                bT = "Navigate to your health history to analyze your previous health data trends."
                tP = '10%'
                nD = DemoStates.LOCATE_EXS_NAV;
                bD = DemoStates.CALENDAR;
                chevPos = {
                    top: '50%',
                    left: '88%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = ''
                break;
            case DemoStates.LOCATE_EXS_NAV:
                hT = "Exercises"
                bT = "Search through your exercises. You can create new ones or edit previous ones."
                sBT = "You already have access to our exercises."
                tP = '30%'
                nD = DemoStates.START_ADD_WO;
                bD = DemoStates.LOCATE_STATS_NAV;
                chevPos = {
                    top: '73%',
                    left: '88%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.START_ADD_WO:
                if (screen !== HomeStackScreens.Home) break;
                hT = "Add A Workout"
                bT = `Let's add a workout for today. Slide up and tap on the maroon box.`
                tP = '55%'
                nD = DemoStates.WO_HEADER;
                bD = DemoStates.LOCATE_EXS_NAV;
                chevPos = {
                    top: '40%',
                    left: '45%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = ''
                break;
            case DemoStates.WO_HEADER:
                if (screen !== HomeStackScreens.WorkoutHeader) break;
                hT = "Workout Details"
                bT = `This is the screen where you can edit the general details of the workout. Let's name this workout "Leg Day". After you entered the name, tap done.`
                sBT = "Type strength training is the only type where name is required. Other workout types go through a different process."
                tP = '50%'
                nD = DemoStates.WO_ADD_EX;
                bD = DemoStates.START_ADD_WO;
                chevPos = {
                    top: '30%',
                    left: '45%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.WO_ADD_EX:
                if (screen !== HomeStackScreens.Workout) break;
                hT = "Workout"
                bT = "This is the general layout of a workout screen. For now, lets add an exercise to this workout. Tap the circle plus button below."
                tP = '10%'
                nD = DemoStates.EX_SEARCH;
                bD = DemoStates.WO_HEADER;
                chevPos = {
                    top: '65%',
                    left: '46%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = `An aerobic workout type will look different. You can also add a workout or a new workout group above.`
                break;

            case DemoStates.EX_SEARCH:
                if (screen !== HomeStackScreens.SearchExercises) break;
                hT = "Exercises"
                bT = "Here you will find all the exercises you can add to your workout. If you can't find what you are looking for you can always add your own. Tap on any exercise."
                tP = '10%'
                nD = DemoStates.WO_EX_ADDED;
                bD = DemoStates.WO_ADD_EX;
                chevPos = {
                    top: '1000%',
                    left: '46%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = ''
                break;
            case DemoStates.WO_EX_ADDED:
                if (screen !== HomeStackScreens.Workout) break;
                hT = "Exercise Added"
                bT = "Now you can see the exercise you selected is added to the workout. Now, tap and hold on 'performing' located in the progress bar below."
                tP = '30%'
                nD = DemoStates.WO_PROGRESS;
                bD = DemoStates.EX_SEARCH;
                chevPos = {
                    top: '75%',
                    left: '46%',
                    transform: [{ rotate: '-90deg' }]
                }
                sBT = `The percentage input will calculate input column 3 (the performing numbers) by using the input box with the calculator icon.`
                break;
            case DemoStates.WO_PROGRESS:
                hT = "Performing Stage"
                bT = "The numbers you add in this stage will be logged as the numbers you performed. Now, drag all the way to the end and tap on the green circle button to complete your workout."
                sBT = 'You can add an image and a description to let other athletes know more about your workout. But for the sake of the demo, we will skip that.'
                tP = '0%'
                nD = DemoStates.WO_COMPLETED;
                bD = DemoStates.WO_EX_ADDED;
                chevPos = {
                    top: '60%',
                    left: '46%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.WO_COMPLETED:
                hT = "Congrats!"
                bT = "You just completed your first workout."
                sBT = 'Your followers will be notified when you complete a workout.'
                tP = '0%'
                nD = DemoStates.END;
                bD = DemoStates.WO_PROGRESS;
                chevPos = {
                    top: '1000%',
                    left: '46%',
                    transform: [{ rotate: '-90deg' }]
                }
                break;
            case DemoStates.END:
                hT = "Final Notes"
                bT = "If you get lost or have a hard time figuring out how to do something, look for the tip icons. They are normally located in our menus"
                sBT = "Please feel free to contact us with any questions, recommendations, and/or issues that you may come across."
                tP = '20%'
                nD = '';
                bD = DemoStates.WO_COMPLETED;
                chevPos = {
                    top: '-100%',
                    right: '5%',
                    transform: [{ rotate: '-180deg' }]
                }
                break;
            default:
        }
        setHeaderText(hT);
        setTopPos(tP);
        setNextDemo(nD);
        setChev({ ...chevPos });
        setSubBodyText(sBT);
        setBackDemo(bD);
        setBodyText(bT);
        setActive(true)
    }

    if (!active) return <></>

    return (
        <>
            <DemoArrow pos={chev} />
            <DemoModal
                headerText={headerText}
                bodyText={bodyText}
                topPos={topPos}
                nextDemo={nextDemo}
                subBodyText={subBodyText}
                backDemo={backDemo}
            />
        </>
    )
}

const mapStateToProps = (state: ReducerProps) => ({
    demoState: state.global.demoState
})

export default connect(mapStateToProps)(DashboardDemo);
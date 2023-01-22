import { useCallback, useEffect } from "react";
import { AppDispatch } from "../../../App";
import { ChatActionProps } from "../../services/chat/types";
import { ExerciseActionProps } from "../../services/exercises/types";
import { MiscActionProps } from "../../services/misc/types";
import { NotificationActionProps } from "../../services/notifications/types";
import { ProgramActionProps } from "../../services/program/types";
import { UserActionProps, UserProps } from "../../services/user/types";
import { SET_SELECTED_DATE } from "../../services/workout/actionTypes";
import { WorkoutActionProps } from "../../services/workout/types";
import DateTools from "../../utils/DateTools";

interface ActionProps {
    fetchWorkouts: WorkoutActionProps['fetchWorkouts'];
    fetchGeneratedPrograms: ProgramActionProps['fetchGeneratedPrograms'];
    getFriends: UserActionProps['getFriends'];
    getChats: ChatActionProps['getChats'];
    initSockets: () => void;
    fetchLocalStoreExercisesToState: ExerciseActionProps['fetchLocalStoreExercisesToState'];
    fetchNotifications: NotificationActionProps['fetchNotifications'];
    processBatches: () => Promise<void>;
    fetchAllUserExercises: ExerciseActionProps['fetchAllUserExercises'];
    getAllHealthData: () => Promise<void>;
    getGlobalVars: () => Promise<void>;
    fetchPinExerciseAnalytics: MiscActionProps['fetchPinExerciseAnalytics'];
}


export function useApiHooks(offline: boolean, user: UserProps, actions: ActionProps, dispatch: AppDispatch) {

    const onMonthChange = async () => {
        //fetch the month workotus
        const d = new Date();
        const m = d.getMonth() + 1
        const amtOfDays = new Date(d.getFullYear(), m, 0).getDate() //d.getMonth() is the next month
        const fromDate = new Date(d.getFullYear(), m - 1, 1);
        const toDate = new Date(d.getFullYear(), m - 1, amtOfDays);
        const fromDateStr = DateTools.dateToStr(fromDate)
        const toDateStr = DateTools.dateToStr(toDate);
        dispatch({ type: SET_SELECTED_DATE, payload: DateTools.dateToStr(d) })
        await actions.fetchWorkouts(fromDateStr, toDateStr);
    }

    const initReduxState = useCallback(async () => {
        const d = new Date()
        const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        //await for store exercises
        onMonthChange()
        await actions.fetchLocalStoreExercisesToState().catch(err => console.log(err))
        //get all types of programs
        if (!offline) {
            actions.getGlobalVars().catch(err => console.log(err))
            actions.fetchAllUserExercises().catch(err => console.log(err))
            actions.processBatches().catch(err => console.log(err));
            actions.fetchGeneratedPrograms().catch(err => console.log(err))
            actions.getFriends().catch(err => console.log(err))
            actions.getAllHealthData().catch(err => console.log(err))
            actions.initSockets();
            actions.getChats();
            actions.fetchNotifications();
            const endD = DateTools.dateToStr(today);
            const startD = DateTools.dateToStr(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()))
            actions.fetchPinExerciseAnalytics(startD, endD, user.pinExercises).catch(err => console.log(err));
        }
    }, [offline])

    useEffect(() => {
        initReduxState();
    }, [offline])
}
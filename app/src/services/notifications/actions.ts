import { ReducerProps } from "..";
import { AppDispatch } from "../../../App";
import PATHS from "../../utils/PATHS";
import request from "../utils/request";
import { INSERT_NOTIFICATION, SET_NOTIFICATIONS } from "./actionTypes";
import { NotificationProps, NotificationTypes } from "./types";
import notifee from '@notifee/react-native';
import AutoId from "../../utils/AutoId";
import { INSERT_MY_PROGRAM_LIKE } from "../program/actionTypes";
import { INSERT_MY_WORKOUT_LIKE } from "../workout/actionTypes";
import { NetworkStackScreens } from "../../screens/network/types";

export const fetchNotifications = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    return request("GET", PATHS.notificatons.get, dispatch)
        .then(({ data }: { data?: NotificationProps[] }) => {
            if (data) {
                dispatch({
                    type: SET_NOTIFICATIONS,
                    payload: data.sort((a, b) => {
                        const aDate = new Date(a.createdAt);
                        const bDate = new Date(b.createdAt);
                        return bDate.getTime() - aDate.getTime();
                    })
                })
            }
        })
        .catch((err) => console.log(err))
}

export const processNotification = (screen: string, title?: string, body?: string, data?: { [key: string]: any }) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    if (data && data.notificationType) {

        switch (data.notificationType) {
            case NotificationTypes.LIKE_WORKOUT:
                if (data.senderProps && data.workoutUid) {
                    dispatch({ type: INSERT_MY_WORKOUT_LIKE, payload: { uid: data.senderProps.uid as string, workoutUid: data.workoutUid } })
                }
                break;
            case NotificationTypes.LIKE_PROGRAM:
                if (data.senderProps && data.programUid) {
                    dispatch({ type: INSERT_MY_PROGRAM_LIKE, payload: { uid: data.senderProps.uid as string, programUid: data.programUid } })
                }
                break;
            case NotificationTypes.PROGRAM_ACCESSED:
            case NotificationTypes.WORKOUT_UPDATE:
            case NotificationTypes.FRIEND_REQUEST:
            case NotificationTypes.NEW_MESSAGE:
            default:
        }

        const notificationData = {
            _id: AutoId.newId(20),
            title,
            body,
            notificationType: data.notificationType,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            data: data
        }

        dispatch({
            type: INSERT_NOTIFICATION,
            payload: notificationData
        })
        //don't display notification if on the same screen for messaging
        if (
            data.notificationType === NotificationTypes.NEW_MESSAGE &&
            screen === NetworkStackScreens.Message &&
            data.chatId
        ) {
            //get the current chat and identify if the new message is in the current chat
            //don't display notification if it is
            const { chat } = getState();
            if (chat.curChat && chat.curChat._id === data.chatId) return;
        }
    }

    notifee.displayNotification({
        title,
        body,
        data: data
    })
}

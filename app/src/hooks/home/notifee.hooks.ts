import { useEffect } from "react";
import notifee, { Event, EventType } from '@notifee/react-native';
import { NetworkStackScreens } from "../../screens/network/types";
import { IndexStackList } from "../../screens/types";
import { SET_CURRENT_ATHLETE } from "../../services/athletes/actionTypes";
import { NotificationActionProps, NotificationTypes } from "../../services/notifications/types";
import { AppDispatch } from "../../../App";
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getRootNavigationState } from "../../RootNavigation";



export function useNotifeeListener(navigation: any, processNotification: NotificationActionProps['processNotification'], dispatch: AppDispatch) {


    const getCurrentScreen = () => {
        let currentRootScreen = '';
        const routeState = getRootNavigationState();
        if (routeState) {
            currentRootScreen = routeState.name;
        }
        return currentRootScreen
    }

    const onMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const { notification, data } = remoteMessage;
        if (!notification) return;
        const currentRootScreen = getCurrentScreen()
        processNotification(currentRootScreen, notification.title, notification.body, data)
    }


    const routeIsInNetworkStack = () => {
        let sameStack = false;
        const currentRootScreen = getCurrentScreen();
        if (currentRootScreen) {
            let found = Object.values(NetworkStackScreens).find((screen) => screen === currentRootScreen)
            if (found) {
                sameStack = true
            }
        }
        return sameStack
    }



    const onForegroundEvent = ({ type, detail }: Event) => {
        switch (type) {
            case EventType.DISMISSED:
                break;
            case EventType.PRESS:
                const { notification } = detail;

                if (!notification || !notification.data) return;

                const { notificationType, senderProps, chatId }: { notificationType?: NotificationTypes, senderProps?: string, chatId?: string } = notification.data;

                //if notification type is message, send to message screen with chat
                //if notification is anything else navigate to the athlete profile
                if (!notificationType) return;

                if (notificationType === NotificationTypes.NEW_MESSAGE && chatId) {
                    //identify if it's in the same stack
                    if (routeIsInNetworkStack()) {
                        navigation.navigate(NetworkStackScreens.Message, { chatId })
                    } else {
                        navigation.navigate(IndexStackList.NetworkStack, { screen: NetworkStackScreens.Chats, params: { chatId } })
                    }
                    return;
                }

                if (notificationType === NotificationTypes.FRIEND_REQUEST) {
                    navigation.navigate(IndexStackList.NetworkStack, { screen: NetworkStackScreens.Notifications })
                    return;
                }

                if (senderProps) {
                    //navigate to athlete 
                    let athlete = JSON.parse(senderProps)
                    dispatch({ type: SET_CURRENT_ATHLETE, payload: athlete })
                    if (routeIsInNetworkStack()) {
                        navigation.push(NetworkStackScreens.AthleteDashboard, { athlete })
                    } else {
                        navigation.navigate(IndexStackList.NetworkStack, { screen: NetworkStackScreens.SearchAthletes, params: { athlete } })
                    }
                    return;
                }
        }
    }

    useEffect(() => {
        notifee.onForegroundEvent(onForegroundEvent)
        const unsubscribe = messaging().onMessage(onMessage);
        return () => {
            unsubscribe()

        }
    }, [])
}
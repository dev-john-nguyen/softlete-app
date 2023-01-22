/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import React from 'react';
import notifee, { EventType } from '@notifee/react-native';

//pop notification with notifee
//when the user opens the app how will I navigate to the screen of the notification
messaging().setBackgroundMessageHandler(async (message) => {

    const { notification, data } = message;

    //display notification
    notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data: data
    })

    //increase badge count
    notifee.incrementBadgeCount().catch(err => console.log(err))
});

//handle background event for when the notification is displayed in the background
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS) {
        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }
});

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}


AppRegistry.registerComponent(appName, () => HeadlessCheck);

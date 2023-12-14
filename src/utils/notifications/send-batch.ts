import Users from '../../collections/users';
import admin from 'firebase-admin';
import _ from 'lodash';
import Notifications, { NotificationTypes } from '../../collections/notifications';

export default async function sendBatchNotification(uids: string[], title: string, body: string, data?: { [str: string]: string }, notificationType?: NotificationTypes) {
    const Messaging = admin.messaging();

    try {
        const usersDoc = await Users.find({ uid: { $in: uids } })

        if (usersDoc.length < 1) return;

        const tokens: string[] = [];
        const notifyStore: any[] = [];

        usersDoc.forEach((doc) => {
            if (doc.notificationToken) {
                tokens.push(doc.notificationToken)
            }
            if (notificationType) {
                notifyStore.push({
                    uid: doc.uid,
                    title: title,
                    body: body,
                    notificationType: notificationType,
                    data: data ? { ...data } : undefined
                })
            }
        })

        if (notifyStore.length > 0) {
            Notifications.insertMany(notifyStore).catch(err => console.log(err))
        }


        if (tokens.length < 1) return;

        const titleStr = title.slice(0, 100)
        const bodyStr = body.slice(0, 150)

        const message: admin.messaging.MulticastMessage = {
            notification: {
                title: titleStr,
                body: bodyStr
            },
            data: data,
            tokens: _.uniq(tokens),
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    }
                },
                headers: {
                    'apns-push-type': 'background',
                    'apns-priority': '5',
                    'apns-topic': '', // your app bundle identifier
                }
            }
        }

        return await Messaging.sendMulticast(message)
    } catch (err) {
        console.log(err)
    }
}
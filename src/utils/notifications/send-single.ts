import Users from '../../collections/users';
import admin from 'firebase-admin';
import Notifications, { NotificationTypes } from '../../collections/notifications';

async function sendSingleNotification(receiverUid: string, title: string, body: string, data?: { [str: string]: string }, notificationType?: NotificationTypes) {
    const Messaging = admin.messaging()
    try {
        const userDoc = await Users.findOne({ uid: receiverUid })

        if (!userDoc || !userDoc.notificationToken) return;

        if (notificationType) {
            const newNotify = new Notifications({
                uid: userDoc.uid,
                title: title,
                body: body,
                notificationType: notificationType,
                data: data ? { ...data } : undefined
            })
            newNotify.save()
                .catch(err => console.log(err))
        }

        const titleStr = title.slice(0, 100)
        const bodyStr = body.slice(0, 150)

        const message: admin.messaging.TokenMessage = {
            notification: {
                title: titleStr,
                body: bodyStr
            },
            data: data,
            token: userDoc.notificationToken,
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

        return await Messaging.send(message);

    } catch (err) {
        console.log(err)
    }
}

export default sendSingleNotification
import { NotificationTypes } from '../../../collections/notifications';
import Users from '../../../collections/users';
import sendSingleNotification from '../../../utils/notifications/send-single';

export async function handleGenProgramNotification(programUserUid: string, uid: string, name: string) {
    //send notification to owner of another user access
    if (programUserUid !== uid) {
        Users.findOne({ uid: uid })
            .then((userDoc) => {
                if (!userDoc) return;

                const bodyText = `${userDoc.username} accessed your "${name.slice(0, 100)}" program.`
                const title = ''
                const senderProps = userDoc.toObject() as any

                sendSingleNotification(programUserUid, title, bodyText, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.PROGRAM_ACCESSED }, NotificationTypes.PROGRAM_ACCESSED)
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
}

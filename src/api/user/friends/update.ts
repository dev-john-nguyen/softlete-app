const router = require('express').Router();
import Friends, { FriendsSchemaProps, FriendStatus } from '../../../collections/friends';
import socketInstances from '../../../sockets/instances';
import errorCatch from "../../../utils/error-catch";
import Users, { profileFilter } from '../../../collections/users';
import sendSingleNotification from '../../../utils/notifications/send-single';
import { NotificationTypes } from '../../../collections/notifications';
import _ from 'lodash';

router.post('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid, status } = req.body;

    const io = req.app.get('socketio');

    if (!userUid || !status) return res.status(401).send("Invalid request.")

    if (typeof userUid !== 'string' || typeof status !== 'string') return res.status(401).send("Invalid request.")

    if (!Object.values(FriendStatus).includes(status as FriendStatus)) return res.status('Invalid status request')

    const query = { users: { $all: [uid, userUid] } };

    Friends.findOneAndUpdate(query, {
        status: status as FriendStatus,
        lastModUid: uid
    }, { new: true })
        .then(async (doc) => {
            let friendObj: FriendsSchemaProps | undefined;

            if (doc) {
                friendObj = doc.toObject()
            } else {
                //create new doc
                const newFriend = new Friends({
                    status: status as FriendStatus,
                    lastModUid: uid,
                    users: [uid, userUid]
                })
                await newFriend.save().then((newDoc) => { friendObj = newDoc.toObject() })
            }

            if (!friendObj) return res.status(500).send("Failed to create/update friend request")

            //send
            res.send(friendObj)

            //get the other user
            const otherUid = friendObj.users.find(u => u !== uid)
            if (otherUid) {
                const socketId = socketInstances[otherUid]?.socketId;

                if (socketId) {
                    io.to(socketId).emit('friend-request', friendObj)
                }

                //only send if pending/created or accepted
                if (friendObj.status === FriendStatus.pending || friendObj.status === FriendStatus.accepted) {
                    handleNotification(uid, otherUid, friendObj.status === FriendStatus.accepted)
                }
            }
        })
        .catch(err => errorCatch(err, res, next))
})

async function handleNotification(uid: string, otherUid: string, accepted: boolean) {
    Users.findOne({ uid: uid }).select(profileFilter)
        .then((userDoc) => {
            if (userDoc) {
                const bodyText = `${userDoc.username} ${accepted ? 'accepted your friend request' : "sent you a friend request"}.`;
                const title = ''
                const senderProps = userDoc.toObject() as any

                sendSingleNotification(otherUid, title, bodyText, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.FRIEND_REQUEST }, NotificationTypes.FRIEND_REQUEST)
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}


export default router;
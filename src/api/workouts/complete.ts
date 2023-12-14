const router = require('express').Router();
import Workout, { WorkoutStatus } from '../../collections/workouts';
import Users, { profileFilter } from '../../collections/users';
import { NotificationTypes } from '../../collections/notifications';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import sendBatchNotification from '../../utils/notifications/send-batch';
import Friends, { FriendsSchemaProps, FriendStatus } from '../../collections/friends';
import _ from 'lodash';
import { removeImageFromStorage } from '../../utils/remove-media';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { _id, status, strainRating, reflection, imageId, localImageUri } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid workout id');

    if (!status || typeof status !== 'string') return res.status(400).send('Invalid status');

    if (typeof reflection !== 'string') return res.status(400).send('Invalid reflection.');

    if (typeof strainRating !== 'number' || strainRating < 0 || strainRating > 5) return res.status(400).send('Invalid rating.');

    if (imageId && (typeof imageId !== 'string')) return res.status(400).send('Invalid image id.');

    if (localImageUri && (typeof localImageUri !== 'string')) return res.status(400).send('Invalid image id.');

    Workout.findByIdAndUpdate(_id, {
        status: status,
        strainRating: strainRating,
        reflection: reflection,
        imageId: imageId,
        localImageUri: localImageUri
    }, { runValidators: true })
        .then(async (doc) => {
            if (!doc) return res.status(500).send("Couldn't find the workout to update.")

            //doc is the old version
            const workout = doc.toObject();

            res.send({
                ...workout,
                status: status,
                strainRating: strainRating,
                reflection: reflection,
                imageId: imageId,
                localImageUri: localImageUri
            })

            //use the old version to determine if the previous image needs to remove from storage
            if (workout.imageId && workout.imageId !== imageId) removeImageFromStorage(uid, [workout.imageId])

            if (doc.sentNotification || status !== WorkoutStatus.completed) return;

            //only send notification if the workout was completed today;
            const workoutDate = new Date(doc.date);
            const today = new Date();

            if (
                workoutDate.getUTCFullYear() !== today.getUTCFullYear() ||
                workoutDate.getUTCMonth() !== today.getUTCMonth() ||
                workoutDate.getUTCDate() !== today.getUTCDate()
            ) return;

            //check if prev workout
            //handle notification
            //don't want to hold up user from response
            handleNotification(uid)
                .catch(err => console.log(err))

            //update sentNotification
            doc.sentNotification = true
            doc.save().catch(err => console.log(err))
        })
        .catch((err) => errorCatch(err, res, next))
})

async function handleNotification(uid: string) {
    const friends = await Friends.find({ users: uid, status: FriendStatus.accepted })

    if (friends.length > 0) {
        const friendsUids: string[] = [];
        friends.forEach((f: FriendsSchemaProps) => {
            const friendUid = f.users.find(u => u !== uid);
            if (friendUid) {
                friendsUids.push(friendUid)
            }
        })

        if (friendsUids.length > 0) {
            //send notifications to all friends
            //only need to get profile information to send to other users
            const user = await Users.findOne({ uid: uid }).select(profileFilter)
            if (user) {

                const title = '';
                const body = `${user.username} completed a workout session.`;
                const senderProps = user.toObject() as any;

                sendBatchNotification(friendsUids, title, body, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.WORKOUT_UPDATE }, NotificationTypes.WORKOUT_UPDATE);
            }
        }

    }
}

export default router;
const router = require('express').Router();
import Workout, { WorkoutProps } from '../../collections/workouts';
import Users from '../../collections/users';
import { NotificationTypes } from '../../collections/notifications';
import { Types } from 'mongoose';
import errorCatch from '../../utils/error-catch';
import sendSingleNotification from '../../utils/notifications/send-single';
import { profileFilter } from '../../collections/users';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { workoutUid } = req.body as { workoutUid: string };

    if (!workoutUid || !Types.ObjectId.isValid(workoutUid)) return res.status(400).send("Invalid workout id.")

    Workout.findOneAndUpdate({ _id: workoutUid, likeUids: { $ne: uid } }, { $push: { likeUids: uid } })
        .then((doc) => {
            if (doc) {
                res.send('like')
                //send notificaiton
                sendNotification(doc.toObject(), doc.userUid, uid).catch(err => console.log(err))
            } else {
                res.send()
            }
        })
        .catch((err) => errorCatch(err, res, next))
})


async function sendNotification(wo: WorkoutProps, receiverUid: string, senderUid: string) {

    const senderProps = await Users.findOne({ uid: senderUid }).select(profileFilter)

    if (senderProps) {
        const title = '';
        const body = `${senderProps.username} liked your ${wo.name} workout.`
        sendSingleNotification(receiverUid, title, body, { senderProps: JSON.stringify(senderProps), notificationType: NotificationTypes.LIKE_WORKOUT, workoutUid: wo._id ? wo._id.toString() : '' }, NotificationTypes.LIKE_WORKOUT)
    }
}

export default router;
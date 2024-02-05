const router = require('express').Router();
import Friends, {
  FriendStatus,
  FriendsSchemaProps,
} from '../../../collections/friends';
import Users, { profileFilter } from '../../../collections/users';
import Workout from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import sendBatchNotification from '../../../utils/notifications/send-batch';
import { NotificationTypes } from '../../../collections/notifications';

router.post('/', (req: any, res: any, next: any) => {
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { _id, status } = req.body;

  if (!status) return res.status(400).send('Invalid data');

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send('Invalid workout id');

  Workout.findByIdAndUpdate(_id, { status: status })
    .then(doc => {
      if (!doc)
        return res
          .status(500)
          .send('Failed to update status of the workout. Please try again');

      // don't process notification if sent already
      if (doc.sentNotification) return;

      const workoutDate = new Date(doc.date);
      const today = new Date();

      if (
        workoutDate.getUTCFullYear() !== today.getUTCFullYear() ||
        workoutDate.getUTCMonth() !== today.getUTCMonth() ||
        workoutDate.getUTCDate() !== today.getUTCDate()
      )
        return;

      //check if prev workout
      //handle notification
      //don't want to hold up user from response
      handleNotification(uid).catch(err => console.log(err));

      //update sentNotification
      doc.sentNotification = true;
      doc.save().catch(err => console.log(err));
    })
    .catch(err => errorCatch(err, res, next));
});

async function handleNotification(uid: string) {
  const friends = await Friends.find({
    users: uid,
    status: FriendStatus.accepted,
  });

  if (friends.length > 0) {
    const friendsUids: string[] = [];
    friends.forEach((f: FriendsSchemaProps) => {
      const friendUid = f.users.find(u => u !== uid);
      if (friendUid) {
        friendsUids.push(friendUid);
      }
    });

    if (friendsUids.length > 0) {
      //send notifications to all friends
      //only need to get profile information to send to other users
      const user = await Users.findOne({ uid: uid }).select(profileFilter);
      if (user) {
        const title = '';
        const body = `${user.username} completed a workout session.`;
        const senderProps = user.toObject() as any;

        sendBatchNotification(
          friendsUids,
          title,
          body,
          {
            senderProps: JSON.stringify(senderProps),
            notificationType: NotificationTypes.WORKOUT_UPDATE,
          },
          NotificationTypes.WORKOUT_UPDATE,
        );
      }
    }
  }
}

export default router;

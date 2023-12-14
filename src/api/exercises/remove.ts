const router = require('express').Router();
import UserExercise from '../../collections/user-exercises';
import Exercise from '../../collections/exercises';
import Users from '../../collections/users';
import UserExerciseMeas from '../../collections/user-exercise-measurements';
import errorCatch from '../../utils/error-catch';
import mongoose from 'mongoose';
import { removeVideoFromStorage } from '../../utils/remove-media';
import { validateAdmin } from '../../utils/authenticate';

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid, admin } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const _id = req.body._id as string;
  const softlete = req.body.softlete as boolean;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send('Exercise id not found.');

  try {
    let exercise;
    if (softlete) {
      if (!validateAdmin(uid) && !admin) {
        return res.status(401).send('Not an authorized user.');
      }
      exercise = await Exercise.findOneAndRemove({ _id: _id });
    } else {
      exercise = await UserExercise.findOneAndRemove({
        _id: _id,
        userUid: uid,
      });
    }

    if (!exercise) return res.status(400).send('Exercise not found.');

    if (exercise.videoId) removeVideoFromStorage(uid, [exercise.videoId]);

    await UserExerciseMeas.findOneAndDelete({ exerciseUid: _id, userUid: uid });
    //remove pin if exists
    await Users.findOneAndUpdate(
      { uid: uid },
      { $pull: { pinExercises: { exerciseUid: _id } } },
    );

    res.send('Successfully removed.');
  } catch (err) {
    return errorCatch(err, res, next);
  }
});

export default router;

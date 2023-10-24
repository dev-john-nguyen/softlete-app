const router = require('express').Router();
import UserExercise, {
  UserExerciseSchemaProps,
} from '../../../collections/user-exercises';
import Exercises, { ExerciseSchemaProps } from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import UserExerciseMeas, {
  MeasCats,
  MeasSubCats,
} from '../../../collections/user-exercise-measurements';
import mongoose from 'mongoose';
import { removeVideoFromStorage } from '../../../utils/remove-media';
import { validateAdmin } from '../../../utils/authenticate';

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid, admin } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const {
    name,
    description,
    category,
    localUrl,
    localThumbnail,
    _id,
    measCat,
    measSubCat,
    equipment,
    muscleGroups,
    videoId,
    youtubeId,
    softlete,
  } = req.body;

  if (!name || !_id) return res.status(400).send('Name and Id is required.');

  //ensure url is a youtube url
  if (youtubeId && typeof youtubeId !== 'string')
    return res.status(400).send('Invalid youtube url.');
  if (localUrl && typeof localUrl !== 'string')
    return res.status(400).send('Invalid video url');
  if (localThumbnail && typeof localThumbnail !== 'string')
    return res.status(400).send('Invalid video thumbnail');
  if (videoId && typeof videoId !== 'string')
    return res.status(400).send('Invalid video id');
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send('Invalid id.');

  try {
    const updatedExercise: Omit<UserExerciseSchemaProps, 'userUid'> = {
      name,
      description,
      localUrl,
      category,
      equipment,
      muscleGroups,
      youtubeId,
      videoId,
      localThumbnail,
    };

    let updatedExerciseDoc:
      | UserExerciseSchemaProps
      | ExerciseSchemaProps
      | undefined
      | null;

    let owner = false;

    if (softlete) {
      // validate permissions for softlete
      if (!validateAdmin(uid) && !admin) {
        return res.status(401).send('Not an authorized user.');
      }

      updatedExerciseDoc = await Exercises.findByIdAndUpdate(
        _id,
        updatedExercise,
        { new: true, runValidators: true },
      ).then(doc => {
        if (!doc) return null;
        return doc.toObject();
      });

      owner = false; // not owner, it's softlete's
    } else {
      updatedExerciseDoc = await UserExercise.findOneAndUpdate(
        { _id: _id, userUid: uid },
        updatedExercise,
        { runValidators: true },
      ).then(doc => {
        if (!doc) return;
        //doc is the old version
        const oldDoc = doc.toObject();

        if (oldDoc.videoId && oldDoc.videoId !== updatedExercise.videoId) {
          //video changed remove
          removeVideoFromStorage(uid, [oldDoc.videoId]);
        }

        return {
          ...oldDoc,
          ...updatedExercise,
        };
      });
      owner = true; // owner is true
    }

    if (!updatedExerciseDoc)
      return res.status(404).send('Exercise does not exists.');

    await UserExerciseMeas.findOneAndUpdate(
      { userUid: uid, exerciseUid: updatedExerciseDoc._id },
      {
        measCat: measCat ? measCat : MeasCats.none,
        measSubCat: measSubCat ? measSubCat : MeasSubCats.none,
      },
      { new: true, runValidators: true },
    );

    return res.send({
      ...updatedExerciseDoc,
      measCat: measCat ? measCat : MeasCats.none,
      measSubCat: measSubCat ? measSubCat : MeasSubCats.none,
      owner,
      softlete,
    });
  } catch (err) {
    return errorCatch(err, res, next);
  }
});

export default router;

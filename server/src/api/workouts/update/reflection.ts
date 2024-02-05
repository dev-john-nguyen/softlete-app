const router = require('express').Router();
import Workout from '../../../collections/workouts';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import _ from 'lodash';
import { removeImageFromStorage } from '../../../utils/remove-media';

router.post('/', (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { _id, strainRating, reflection, imageId, localImageUri } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send('Invalid workout id');

  if (typeof reflection !== 'string')
    return res.status(400).send('Invalid reflection.');

  if (typeof strainRating !== 'number' || strainRating < 0 || strainRating > 5)
    return res.status(400).send('Invalid rating.');

  if (imageId && typeof imageId !== 'string')
    return res.status(400).send('Invalid image id.');

  if (localImageUri && typeof localImageUri !== 'string')
    return res.status(400).send('Invalid image id.');

  Workout.findByIdAndUpdate(
    _id,
    {
      strainRating: strainRating,
      reflection: reflection,
      imageId: imageId,
      localImageUri: localImageUri,
    },
    { runValidators: true },
  )
    .then(async doc => {
      if (!doc)
        return res.status(500).send("Couldn't find the workout to update.");

      // doc is the old version
      const workout = doc.toObject();

      res.send({
        ...workout,
        strainRating: strainRating,
        reflection: reflection,
        imageId: imageId,
        localImageUri: localImageUri,
      });

      // use the old version to determine if the previous image needs to remove from storage
      if (workout.imageId && workout.imageId !== imageId)
        removeImageFromStorage(uid, [workout.imageId]);
    })
    .catch(err => errorCatch(err, res, next));
});

export default router;

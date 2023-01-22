const router = require('express').Router();
import Workout from '../../../../collections/workouts';
import errorCatch from '../../../../utils/error-catch';
import mongoose from 'mongoose';
import { validUri } from '../../../../utils/validations';

router.post('/', (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const { workoutsImages } = req.body as {
    workoutsImages: {
      _id: string;
      imageId: string;
    }[];
  };

  if (!workoutsImages || !Array.isArray(workoutsImages))
    return res.status(400).send('Invalid request.');

  let batch = [];

  for (let i = 0; i < workoutsImages.length; i++) {
    const { _id, imageId } = workoutsImages[i];

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(400).send('Invalid workout id');

    if (imageId && (typeof imageId !== 'string' || imageId.length > 20))
      return res.status(400).send('Invalid image id.');

    batch.push({
      updateOne: {
        filter: { _id },
        update: { imageId },
      },
    });
  }

  if (batch.length < 1) return res.status(400).send('Nothing to save');

  Workout.bulkWrite(batch as any)
    .then(updates => {
      res.send();
    })
    .catch(err => errorCatch(err, res, next));
});

export default router;

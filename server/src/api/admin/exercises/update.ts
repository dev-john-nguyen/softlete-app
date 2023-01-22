const router = require('express').Router();
import Exercises from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
  //user has a id token
  //verify token
  const { uid } = req.headers;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const {
    name,
    description,
    category,
    localUrl,
    localThumbnail,
    _id,
    equipment,
    muscleGroup,
    videoId,
    youtubeId,
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
    const updatedExercise = {
      name,
      description,
      localUrl,
      category,
      equipment,
      muscleGroup,
      youtubeId,
      videoId,
      localThumbnail,
    };

    let exerciseDoc: any = await Exercises.findOneAndUpdate(
      { _id: _id, userUid: uid },
      updatedExercise,
      { new: true, runValidators: true },
    );

    if (!exerciseDoc) return res.status(404).send('Exercise does not exists.');

    return res.send(exerciseDoc.toObject());
  } catch (err) {
    return errorCatch(err, res, next);
  }
});

export default router;

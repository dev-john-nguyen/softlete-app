const router = require('express').Router();
import UserExercise, {
  UserExerciseSchemaProps,
} from '../../collections/user-exercises';
import Exercises, { ExerciseSchemaProps } from '../../collections/exercises';
import UserExerciseMeas from '../../collections/user-exercise-measurements';
import errorCatch from '../../utils/error-catch';
import {
  MeasCats,
  MeasSubCats,
} from '../../collections/user-exercise-measurements';
import { validateAdmin } from '../../utils/authenticate';
import { NextFunction, Request, Response } from 'express';

type NewExerciseProps = Omit<ExerciseSchemaProps, '_id'>;

async function softleteHandler(
  exercise: NewExerciseProps,
  userParams: { uid: string; admin: boolean },
  routerParams: { res: Response; next: NextFunction },
) {
  // validate permissions for softlete
  if (!validateAdmin(userParams.uid) && !userParams.admin) {
    return routerParams.res.status(401).send('Not an authorized user.');
  }

  //check if exercise already exists
  const docs = await Exercises.countDocuments({ name: exercise.name }).catch(
    err => console.log(err),
  );

  if (docs)
    return routerParams.res
      .status(401)
      .send('Exercise already exists. Please try again.');

  Exercises.findOneAndUpdate({ videoId: exercise.videoId }, exercise, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then(doc => {
      doc
        ? routerParams.res.send(doc.toObject())
        : routerParams.res.status(500).send('Unexpected error occurred.');
    })
    .catch(err => errorCatch(err, routerParams.res, routerParams.next));
}

async function userHandler(
  data: UserExerciseSchemaProps,
  measProps: { measCat?: MeasCats; measSubCat?: MeasSubCats },
  uid: string,
  routerParams: { res: Response; next: NextFunction },
) {
  const exercise = await UserExercise.findOneAndUpdate(
    { videoId: data.videoId, userUid: uid },
    data,
    { new: true, runValidators: true, upsert: true },
  );

  const newExMeas = new UserExerciseMeas({
    userUid: uid,
    exerciseUid: exercise._id,
    measCat: measProps.measCat ? measProps.measCat : MeasCats.none,
    measSubCat: measProps.measSubCat ? measProps.measSubCat : MeasSubCats.none,
    isSoftlete: false,
  });

  await newExMeas.save();

  const { measCat: saveMeasCat, measSubCat: saveMeasSubCat } =
    newExMeas.toObject();

  routerParams.res.send({
    ...exercise.toObject(),
    measCat: saveMeasCat,
    measSubCat: saveMeasSubCat,
  });
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  //user has a id token
  //verify token
  const uid = req.headers.uid as string;
  const admin = !!req.headers.admin;

  if (!uid) return res.status(401).send('cannot find user id.');

  if (!req.body) return res.status(400).send('Invalid request');

  const {
    name,
    description,
    category,
    localUrl,
    localThumbnail,
    measCat,
    measSubCat,
    equipment,
    muscleGroups,
    youtubeId,
    videoId,
    softlete,
  } = req.body;

  if (!name) return res.status(400).send('Name is required.');

  //ensure url is a youtube url
  if (youtubeId && typeof youtubeId !== 'string')
    return res.status(400).send('Invalid youtube id.');

  if (localUrl && typeof localUrl !== 'string')
    return res.status(400).send('Invalid video url');

  if (localThumbnail && typeof localThumbnail !== 'string')
    return res.status(400).send('Invalid video thumbnail');

  if (videoId && typeof videoId !== 'string')
    return res.status(400).send('Invalid video id');

  try {
    if (softlete) {
      const exercise: NewExerciseProps = {
        name: name,
        description,
        localUrl: localUrl ? localUrl : '',
        category,
        equipment,
        muscleGroups,
        youtubeId: youtubeId ? youtubeId : '',
        videoId: videoId ? videoId : '',
        localThumbnail: localThumbnail ? localThumbnail : '',
        measCat,
        measSubCat,
      };
      return await softleteHandler(exercise, { uid, admin }, { res, next });
    } else {
      const data: UserExerciseSchemaProps = {
        userUid: uid as string,
        name: name,
        description,
        localUrl: localUrl ? localUrl : '',
        category,
        equipment,
        muscleGroups,
        youtubeId: youtubeId ? youtubeId : '',
        videoId: videoId ? videoId : '',
        localThumbnail: localThumbnail ? localThumbnail : '',
      };
      return await userHandler(data, { measCat, measSubCat }, uid, {
        res,
        next,
      });
    }
  } catch (err) {
    return errorCatch(err, res, next);
  }
});

export default router;

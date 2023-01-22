const router = require('express').Router();
import UserExercise from '../../collections/user-exercises';
import UserExerciseMeas from '../../collections/user-exercise-measurements';
import errorCatch from '../../utils/error-catch';
import { MeasCats, MeasSubCats } from '../../collections/user-exercise-measurements';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { name, description, category, localUrl, localThumbnail, measCat, measSubCat, equipment, muscleGroup, youtubeId, videoId } = req.body;

    if (!name) return res.status(400).send('Name is required.')

    //ensure url is a youtube url
    if (youtubeId && typeof youtubeId !== 'string') return res.status(400).send('Invalid youtube id.');

    if (localUrl && typeof localUrl !== 'string') return res.status(400).send("Invalid video url");

    if (localThumbnail && typeof localThumbnail !== 'string') return res.status(400).send("Invalid video thumbnail");

    if (videoId && typeof videoId !== 'string') return res.status(400).send("Invalid video id");

    //need to validate types?
    const data = {
        userUid: uid,
        name: name,
        description,
        localUrl: localUrl ? localUrl : '',
        category,
        equipment,
        muscleGroup,
        youtubeId: youtubeId ? youtubeId : '',
        videoId: videoId ? videoId : '',
        localThumbnail: localThumbnail ? localThumbnail : ''
    }

    try {
        const exercise = await UserExercise.findOneAndUpdate({ videoId, userUid: uid }, data, { new: true, runValidators: true, upsert: true })

        const newExMeas = new UserExerciseMeas({
            userUid: uid,
            exerciseUid: exercise._id,
            measCat: measCat ? measCat : MeasCats.none,
            measSubCat: measSubCat ? measSubCat : MeasSubCats.none,
            isSoftlete: false
        })

        await newExMeas.save();

        const { measCat: saveMeasCat, measSubCat: saveMeasSubCat } = newExMeas.toObject()

        res.send({
            ...exercise.toObject(),
            measCat: saveMeasCat,
            measSubCat: saveMeasSubCat
        })

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;
const router = require('express').Router();
import Video from '../../collections/videos';
import errorCatch from '../../utils/error-catch';
import { validUri } from '../../utils/validations';


router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { url, videoId, thumbnail } = req.body;

    if (!url || !validUri(url)) return res.status(400).send("Invalid video url");

    if (!videoId || typeof videoId !== 'string') return res.status(400).send('Invalid id.');

    if (!thumbnail || typeof thumbnail !== 'string') return res.status(400).send('Invalid thumbnail');

    const video = {
        userUid: uid,
        url,
        videoId,
        thumbnail
    }

    Video.findOneAndUpdate(video, video, { upsert: true, new: true, runValidators: true })
        .then((doc) => res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;
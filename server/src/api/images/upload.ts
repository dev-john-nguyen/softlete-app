const router = require('express').Router();
import Images from '../../collections/images';
import errorCatch from '../../utils/error-catch';
import { validUri } from '../../utils/validations';


router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { url, imageId } = req.body;

    if (!url || !validUri(url)) return res.status(400).send("Invalid image url");

    if (!imageId || typeof imageId !== 'string') return res.status(400).send('Invalid id.');

    const image = {
        userUid: uid,
        url,
        imageId
    }

    Images.findOneAndUpdate(image, image, { upsert: true, new: true, runValidators: true })
        .then((doc) => res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;
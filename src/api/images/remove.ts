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

    const { imageId } = req.body;

    if (!imageId || typeof imageId !== 'string') return res.status(400).send('Invalid id.');

    Images.findOneAndRemove({ imageId })
        .then((doc) => doc && res.send(doc.toObject()))
        .catch((err) => errorCatch(err, res, next))
})

export default router;
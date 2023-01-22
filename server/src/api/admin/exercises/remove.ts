const router = require('express').Router();
import Exercises from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';
import { removeVideoFromStorage } from '../../../utils/remove-media';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { _id } = req.body;

    if (!_id) return res.status(400).send('Id is required.')

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid id.');

    Exercises.findByIdAndRemove(_id)
        .then((doc) => {
            if (doc) {
                if (doc.videoId) removeVideoFromStorage(uid, [doc.videoId])
                return res.send();
            }
            res.status(401).send("Exercise doesn't exists")
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;
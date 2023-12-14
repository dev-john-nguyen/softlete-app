const router = require('express').Router();
import ProgramTemplateExercises from '../../../collections/program-template-exercises';
import errorCatch from '../../../utils/error-catch';
import mongoose from 'mongoose';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { exerciseUid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(exerciseUid)) return res.status(400).send('Invalid exercise id');

    ProgramTemplateExercises.findByIdAndDelete(exerciseUid)
        .then((doc) => {
            res.send(doc?.toObject())
        })
        .catch(err => errorCatch(err, res, next))


})

export default router;
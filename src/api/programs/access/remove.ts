const router = require('express').Router();
import ProgramTemplate from '../../../collections/program-templates';
import mongoose from 'mongoose';
import errorCatch from '../../../utils/error-catch';

router.post('/', (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request');

    const { _id, accessCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(401).send("Invalid program id.");

    ProgramTemplate.findOneAndUpdate({ _id, userUid: uid }, { $pull: { accessCodes: accessCode } }, { new: true })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject().accessCodes)
            } else {
                res.status(500).send("Failed to insert access code. Please try again.")
            }
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;
import mongoose from "mongoose";
import Users from '../../../collections/users';
import errorCatch from "../../../utils/error-catch";
const router = require('express').Router();
import _ from 'lodash';


router.post('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    const { pinExercise, pin } = req.body as { pinExercise: { exerciseUid: string }, pin: boolean }
    //max length is 10
    if (!pinExercise || typeof pin !== 'boolean') return res.status(401).send('Invalid data');

    if (!mongoose.Types.ObjectId.isValid(pinExercise.exerciseUid)) return res.status(401).send('Invalid Id associated withe request');

    const operator = pin ? {
        $push: { pinExercises: pinExercise }
    } : {
        $pull: { pinExercises: { exerciseUid: pinExercise.exerciseUid } }
    }

    Users.findOneAndUpdate({ uid: uid }, operator, { new: true })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject().pinExercises);
            } else {
                res.status(500).send("Failed to update");
            }
        })
        .catch((err) => errorCatch(err, res, next))

})


export default router;
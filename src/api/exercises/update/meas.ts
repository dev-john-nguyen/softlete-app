const router = require('express').Router();
import UserExercise from '../../../collections/user-exercises';
import Exercises from '../../../collections/exercises';
import errorCatch from '../../../utils/error-catch';
import UserExerciseMeas, { MeasCats, MeasSubCats } from '../../../collections/user-exercise-measurements';

router.post('/', async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.")

    if (!req.body) return res.status(400).send('Invalid request')

    const { _id, measCat, measSubCat, softlete } = req.body;

    let isSoftlete = softlete;

    if (!_id || !measCat || !measSubCat) return res.status(400).send('Name, description and exercise Id is required.')

    try {

        //find exerciseUid
        let exDoc;

        if (!softlete) {
            exDoc = await UserExercise.findById(_id);
            isSoftlete = false;
        }

        if (!exDoc) {
            exDoc = await Exercises.findById(_id)
            isSoftlete = true;
        }

        if (!exDoc) return res.status(404).send("The exercise does not exists.")

        //find the meas joined with exercise or upsert it
        await UserExerciseMeas.findOneAndUpdate({ userUid: uid, exerciseUid: exDoc._id }, {
            measCat: measCat ? measCat : MeasCats.none,
            measSubCat: measSubCat ? measSubCat : MeasSubCats.none
        }, { upsert: true })

        return res.send({
            ...exDoc.toObject(),
            softlete: isSoftlete ? true : false,
            measCat: measCat ? measCat : MeasCats.none,
            measSubCat: measSubCat ? measSubCat : MeasSubCats.none
        })

    } catch (err) {
        return errorCatch(err, res, next)
    }
})

export default router;
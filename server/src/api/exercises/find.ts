const router = require('express').Router();
import UserExercise from '../../collections/user-exercises';
import errorCatch from '../../utils/error-catch';
import apicache from 'apicache';
import fetchExerciseData from './helpers/fetch-exercise-data';
const cache = apicache.middleware;

router.get('/:name?:userUid?', cache('5 minutes'), async (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { name, userUid } = req.query;

    if (!userUid || !name) return res.status(400).send('Request is empty.');


    try {
        const userExDoc = await UserExercise.findOne({
            name: name.toLowerCase(),
            userUid: userUid
        })
        if (!userExDoc) return res.send();

        const exercises = await fetchExerciseData([userExDoc], [], userUid)

        res.send(exercises[0] ? exercises[0] : {})

    } catch (err) {
        return errorCatch(err, res, next)
    }

})

export default router;
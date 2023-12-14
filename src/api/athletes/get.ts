const router = require('express').Router();
import Users, { profileFilter } from '../../collections/users';
import errorCatch from '../../utils/error-catch';
import apicache from 'apicache';
const cache = apicache.middleware;

router.get('/:username?:userUid?', cache("10 minutes"), (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { username, userUid } = req.query;

    if (!username && !userUid) return res.status(401).send('Empty request.');

    Users.findOne({ $or: [{ username }, { uid: userUid }] }).select(profileFilter)
        .then((doc) => {
            if (doc) {
                return res.send(doc.toObject())
            }
            res.send()
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;
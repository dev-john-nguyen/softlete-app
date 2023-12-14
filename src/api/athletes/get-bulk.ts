const router = require('express').Router();
import Users from '../../collections/users';
import errorCatch from '../../utils/error-catch';
import apicache from 'apicache';
const cache = apicache.middleware;

router.get('/:userUids?', cache('10 minutes'), (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUids } = req.query;

    if (!userUids || userUids.length < 1) return res.status(400).send('Request is empty.');

    if (typeof userUids !== 'string') {
        for (let i = 0; i < userUids.length; i++) {
            if (typeof userUids[i] !== 'string') return res.status(400).send('Invalid id associated with request');
        }
    }

    Users.find({ uid: { $in: userUids } }).select({ email: 0 })
        .then((docs) => {
            if (docs) {
                return res.send(docs)
            }
            res.send([])
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;
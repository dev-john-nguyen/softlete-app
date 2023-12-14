const router = require('express').Router();
import Users from '../../collections/users';
import errorCatch from '../../utils/error-catch';
import escapeStringRegexp from '../../utils/escape-string-regexp';
import apicache from 'apicache';
const cache = apicache.middleware;

router.get('/:username?', cache("10 minutes"), (req: any, res: any, next: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { username } = req.query;

    if (!username || typeof username !== 'string') return res.status(401).send("Invalid request")

    const regex: any = escapeStringRegexp(username);
    const options: any = 'i';

    if (!username) return res.status(401).send('Empty request.');

    Users.find({
        username: { $regex: regex, $options: options },
        uid: { $ne: uid },
        deactivated: { $ne: true }
    }).select({
        email: 0
    }).limit(20)
        .then((docs) => {
            res.send(docs)
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;
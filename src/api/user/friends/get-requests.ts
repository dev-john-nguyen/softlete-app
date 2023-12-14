const router = require('express').Router();
import { Response } from 'express';
import Friends, { FriendStatus } from '../../../collections/friends';
import errorCatch from "../../../utils/error-catch";
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

//get user's friend request

router.get('/', cache('10 minutes', cacheOnlyNonOwner), (req: any, res: Response, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    Friends.find({ users: { $in: [uid] }, status: { $ne: FriendStatus.denied } })
        .then((docs) => {
            if (docs) {
                res.send(docs)
            } else {
                res.status(400).send([])
            }
        })
        .catch(err => errorCatch(err, res, next))
})

export default router;
const router = require('express').Router();
import { Request, Response } from 'express';
import Friends, { FriendStatus } from '../../../collections/friends';
import errorCatch from "../../../utils/error-catch";
import apicache from 'apicache';
import cacheOnlyNonOwner from '../../../utils/cache-only-non-owner';
const cache = apicache.middleware;

router.get('/:userUid', cache('10 minutes', cacheOnlyNonOwner), (req: Request, res: Response, next: any) => {
    const { userUid } = req.params;

    if (!userUid) return res.status(401).send("cannot find user id.");

    Friends.find({ users: { $in: [userUid] }, status: FriendStatus.accepted })
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
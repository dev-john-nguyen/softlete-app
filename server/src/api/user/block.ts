const router = require('express').Router();
import Users from '../../collections/users';
import errorCatch from "../../utils/error-catch";

router.post('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid } = req.body;

    if (!userUid || typeof userUid !== 'string') return res.status(400).send("Invalid user id.")

    Users.findOneAndUpdate({ uid: uid, blockUids: { $ne: uid } }, { $push: { blockUids: userUid } }, { runValidators: true, new: true }).select({ _v: 0, _id: 0 })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.status(400).send('Not able to find user.')
            }
        })
        .catch(err => errorCatch(err, res, next))

})

export default router;
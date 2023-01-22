const router = require('express').Router();
import Users from '../../collections/users';
import errorCatch from "../../utils/error-catch";

router.get('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send("cannot find user id.")

    Users.findOne({ uid: uid, deactivated: { $ne: true } }).select({
        _v: 0,
        _id: 0,
    })
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
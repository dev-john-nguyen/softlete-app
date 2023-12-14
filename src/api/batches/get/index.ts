const router = require('express').Router();
import Batches from "../../../collections/batches";
import errorCatch from "../../../utils/error-catch";

router.get('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    Batches.findOne({ userUid: uid })
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.send()
            }
        })
        .catch((err) => errorCatch(err, res, next))

})

export default router;
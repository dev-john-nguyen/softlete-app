const router = require('express').Router();
import Batches from "../../../collections/batches";
import errorCatch from "../../../utils/error-catch";

router.post('/', (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { batch } = req.body as { batch: [any] };

    Batches.findOneAndUpdate({ userUid: uid }, { exVideoBatch: batch }, { new: true })
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
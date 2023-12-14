const router = require('express').Router();
import Bugs from "../../collections/bugs";
import errorCatch from "../../utils/error-catch";
import rateLimit from "express-rate-limit";

const createAccountLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minute window
    max: 10, // start blocking after 5 requests
    message: "Too many reports created from this IP, please try again later."
});

router.post('/', createAccountLimiter, (req: any, res: any, next: any) => {
    const { uid } = req.headers;

    if (!uid) return res.status(401).send("cannot find user id.");

    const { description, type } = req.body;

    const newBug = new Bugs({
        userUid: uid,
        description: description,
        type: type
    })

    newBug.save()
        .then((doc) => {
            if (doc) {
                res.send(doc.toObject())
            } else {
                res.status(500).send("Unexpected error occurred.")
            }
        })
        .catch((err) => errorCatch(err, res, next))
})

export default router;
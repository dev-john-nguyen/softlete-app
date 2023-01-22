const router = require('express').Router();
import Reports from "../../collections/reports";
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

    const { userUid, description, exerciseUid } = req.body;

    if (!userUid || typeof userUid !== 'string') return res.status(401).send("Invalid user id.");

    if (!exerciseUid || typeof exerciseUid !== 'string') return res.status(401).send("Invalid exercise.")

    const newReport = new Reports({
        reportedUserUid: userUid,
        userUid: uid,
        description: description,
        typeId: exerciseUid,
        type: 'exercise'
    })

    newReport.save()
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
const router = require('express').Router();
import Reports from "../../collections/reports";
import errorCatch from "../../utils/error-catch";
import rateLimit from "express-rate-limit";

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many reports created from this IP, please try again later."
});

router.post('/', createAccountLimiter, (req: any, res: any, next: any) => {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send("cannot find user id.");

    const { userUid, description, workoutUid } = req.body;

    if (!userUid || typeof userUid !== 'string') return res.status(401).send("Invalid user id.");

    if (!description || typeof description !== 'string') return res.status(401).send("Invalid description.")

    if (!workoutUid || typeof workoutUid !== 'string') return res.status(401).send("Invalid workout Uid.")

    const newReport = new Reports({
        reportedUserUid: userUid,
        userUid: uid,
        description: description,
        typeId: workoutUid,
        type: 'workout'
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
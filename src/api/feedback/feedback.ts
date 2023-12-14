const router = require('express').Router();
import Feedback from "../../collections/feedback";
import errorCatch from "../../utils/error-catch";
import rateLimit from "express-rate-limit";

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many feedbacks submitted from this IP, please try again later."
});

const invalidMsg = "Invalid data."

router.post('/', createAccountLimiter, (req: any, res: any, next: any) => {
    const { ui, advice, valueRating, bugs, comments } = req.body;

    if (!ui || typeof ui !== 'string') return res.status(401).send(invalidMsg);
    if (!valueRating || typeof valueRating !== 'number') return res.status(401).send(invalidMsg);
    if (advice && typeof advice !== 'string') return res.status(401).send(invalidMsg);
    if (comments && typeof comments !== 'string') return res.status(401).send(invalidMsg);
    if (bugs && typeof bugs !== 'string') return res.status(401).send(invalidMsg);

    const newFeedback = new Feedback({
        ui,
        advice,
        valueRating,
        bugs,
        comments
    })

    newFeedback.save()
        .then((doc) => doc ? res.send() : res.status(500).send("Unexpected error occurred."))
        .catch((err) => errorCatch(err, res, next))
})

export default router;
const router = require('express').Router();
import Contact from "../../collections/contact";
import errorCatch from "../../utils/error-catch";
import rateLimit from "express-rate-limit";

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: "Too many submissions from this IP, please try again later."
});

const invalidMsg = "Invalid data."

router.post('/', createAccountLimiter, (req: any, res: any, next: any) => {
    const { name, email, message } = req.body;

    if (!name || typeof name !== 'string') return res.status(401).send(invalidMsg);
    if (!email || typeof email !== 'string') return res.status(401).send(invalidMsg);
    if (!message || typeof message !== 'string') return res.status(401).send(invalidMsg);

    const newContact = new Contact({
        name, email, message
    })

    newContact.save()
        .then((doc) => doc ? res.send() : res.status(500).send("Unexpected error occurred."))
        .catch((err) => errorCatch(err, res, next))
})

export default router;
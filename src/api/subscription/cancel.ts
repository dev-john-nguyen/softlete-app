const router = require('express').Router();
import _ from 'lodash';
import Stripe from 'stripe';
const stripe: Stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY);
import express from 'express';
import Subscriptions from '../../collections/subscriptions';


router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { uid } = req.headers as { uid: string };
    Subscriptions.findOne({ uid: uid })
        .then(async (doc) => {
            if (!doc) return res.status(404).send("Subscription not found");
            if (!doc.stripeSubId) return res.status(404).send("Looks like you don't have an active subscription.");
            await stripe.subscriptions.del(doc.stripeSubId);
            doc.subStatus = 'cancel';
            doc.stripeSubId = '';
            await doc.save();
            res.send('Successfully unsubscribed. You will still have access to this service until the end of this subscription period.')
        })
        .catch((err) => {
            console.log(err)
            res.status(err.statusCode ? err.statusCode : 500).send(err.message ? err.message : 'Unexpected error occurred. Please try again.')
        })
});

export default router;
const router = require('express').Router();
import _ from 'lodash';
import Stripe from 'stripe';
const stripe: Stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY);
import express from 'express';
import Subscriptions, { SubscriptionProps } from '../../collections/subscriptions';
import mongoose from 'mongoose'


router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const { uid } = req.headers as { uid: string };

    const { paymentMethodId } = req.body;

    let userSubDoc: mongoose.Document<any, any, SubscriptionProps> & SubscriptionProps & {
        _id: mongoose.Types.ObjectId;
    } | null;

    try {
        userSubDoc = await Subscriptions.findOne({ uid: uid })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Sorry, unexpected error occurred initializing your subscription.')
    }

    if (!userSubDoc) return res.status(404).send('Not able to find your account.')

    try {
        const customer = await stripe.customers.retrieve(userSubDoc.stripeCustomerId);

        const paymentMethod = await stripe.paymentMethods.attach(
            paymentMethodId,
            { customer: customer.id }
        );

        await stripe.customers.update(
            customer.id,
            {
                invoice_settings: {
                    default_payment_method: paymentMethod.id
                }
            }
        );

        res.send('success')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Sorry, unexpected error occurred.')
    }
});

export default router;
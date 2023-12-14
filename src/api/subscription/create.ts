const router = require('express').Router();
import _ from 'lodash';
import Stripe from 'stripe';
const stripe: Stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY);
import express from 'express';
import Subscriptions, { SubscriptionProps, SubTypes } from '../../collections/subscriptions';
import mongoose from 'mongoose'
import { monthlySubId } from './constants';


router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const { uid } = req.headers as { uid: string };

    const { email } = req.body;

    if (!email) return res.status(401).send('Email is required')
    // save the customer.id as stripeCustomerId
    // in your database.

    let userSubDoc: mongoose.Document<any, any, SubscriptionProps> & SubscriptionProps & {
        _id: mongoose.Types.ObjectId;
    };

    try {
        userSubDoc = await Subscriptions.findOne({ uid: uid })
            .then(async (doc) => {
                if (doc) return doc;
                //create a new doc if it doesn't exists
                const newUserSub = new Subscriptions({ uid: uid })
                await newUserSub.save()
                return newUserSub;
            })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Sorry, unexpected error occurred initializing your subscription.')
    }


    let customer: any;

    try {
        if (userSubDoc.stripeCustomerId) {
            customer = await stripe.customers.retrieve(userSubDoc.stripeCustomerId);
        } else {
            // Create a new customer object
            customer = await stripe.customers.create({ email: req.body.email });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Sorry, unexpected error occurred initializing your subscription.')
    }

    //remove the old description
    if (userSubDoc.stripeSubId) {
        stripe.subscriptions.del(userSubDoc.stripeSubId)
            .catch((err) => console.log(err))
    }

    let subscription: any

    try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: monthlySubId,
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent']
        });


        //update userSubDoc with all data
        userSubDoc.stripeCustomerId = customer.id;
        userSubDoc.stripeSubId = subscription.id;
        userSubDoc.subStatus = 'init';
        userSubDoc.subType = SubTypes.monthly;
        userSubDoc.subPrice = subscription.items.data[0].price.unit_amount;

        await userSubDoc.save();

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        if (subscription) {
            stripe.subscriptions.del(subscription.id)
                .catch((err: any) => console.log(err))
        }

        userSubDoc.stripeCustomerId = ''
        userSubDoc.stripeSubId = ''
        userSubDoc.subStatus = '';
        userSubDoc.save()
            .catch((err: any) => console.log(err))

        return res.status(400).send({ error: { message: error.message } });
    }
});

export default router;
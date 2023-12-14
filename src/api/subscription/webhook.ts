import Stripe from 'stripe';
const router = require('express').Router();
const stripe: Stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY);
import subscriptionHelper from './helpers/subscription'

router.post('/', (req: any, res: any, next: any) => {

    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = process.env.STRIPE_TEXT_END_POINT_SECRET;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    let event: Stripe.Event | undefined;

    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }
    }

    if (!event) return res.sendStatus(400);

    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
        case 'customer.subscription.trial_will_end':
            subscription = event.data.object as Stripe.Subscription;
            status = subscription.status;
            console.log(`Subscription status is ${status}.`);
            // Then define and call a method to handle the subscription trial ending.
            // handleSubscriptionTrialEnding(subscription);
            break;
        case 'customer.subscription.deleted':
            subscriptionHelper.updateSubStatus(event.data.object as Stripe.Subscription)
            break;
        case 'customer.subscription.created':
            subscriptionHelper.updateSubStatus(event.data.object as Stripe.Subscription)
            break;
        case 'customer.subscription.updated':
            subscriptionHelper.updateSubStatus(event.data.object as Stripe.Subscription)
            break;
        case 'invoice.payment_failed':
            subscriptionHelper.handlePaymentFailed(event.data.object as Stripe.Invoice)
            break;
        case 'invoice.upcoming':
            //few days prior to renewal
            console.log('upcoming')
            break;
        case 'invoice.paid':
            //subscription paid
            subscriptionHelper.handleInvoicePaid(event.data.object as Stripe.Invoice)
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 res to acknowledge receipt of the event
    res.send();
})


export default router;
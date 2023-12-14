import Stripe from 'stripe';
import Subscriptions, { SubscriptionProps, SubTypes } from '../../../collections/subscriptions';

export const updateSubStatus = (subscription: Stripe.Subscription) => {
    //get the user subscription doc
    const query = {
        $or: [
            {
                stripeSubId: subscription.id
            },
            {
                stripeCustomerId: subscription.customer.toString()
            }
        ]
    }
    Subscriptions.findOneAndUpdate(query, { subStatus: subscription.status })
        .catch(err => console.log(err))
}

export const updatePaymentDate = (subscription: Stripe.Subscription) => {
    //get the user subscription doc
    const query = {
        $or: [
            {
                stripeSubId: subscription.id
            },
            {
                stripeCustomerId: subscription.customer.toString()
            }
        ]
    }
    Subscriptions.findOneAndUpdate(query, { subStatus: subscription.status })
        .catch(err => console.log(err))
}

export const handlePaymentFailed = (invoice: Stripe.Invoice) => {
    //handle status if payment fails
    //might want to notify user in the future that payment has failed

    if (!invoice.subscription && !invoice.customer) return;

    if (!invoice.payment_intent) return;

    const query = {
        $or: [
            {
                stripeSubId: invoice.subscription ? invoice.subscription.toString() : ''
            },
            {
                stripeCustomerId: invoice.customer ? invoice.customer.toString() : ''
            }
        ]
    }

    const status = typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent.status

    Subscriptions.findOneAndUpdate(query, { subStatus: status })
        .catch(err => console.log(err))
}

export const handleInvoicePaid = (invoice: Stripe.Invoice) => {
    if (!invoice.subscription && !invoice.customer) return;

    const query = {
        $or: [
            {
                stripeSubId: invoice.subscription ? invoice.subscription.toString() : ''
            },
            {
                stripeCustomerId: invoice.customer ? invoice.customer.toString() : ''
            }
        ]
    }

    const invoiceDate = new Date(invoice.created * 1000);
    const newPeriodEnd = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, invoiceDate.getDate() + 2)

    Subscriptions.findOneAndUpdate(query, { subStatus: 'active', currentPeriodEnd: newPeriodEnd, lastPayDate: invoiceDate })
        .catch(err => console.log(err))
}

export default {
    updatePaymentDate,
    updateSubStatus,
    handlePaymentFailed,
    handleInvoicePaid
}
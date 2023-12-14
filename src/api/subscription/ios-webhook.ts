const router = require('express').Router();
import axios from 'axios';
import Subscriptions, { SubscriptionProps } from '../../collections/subscriptions';
import iosHelperActions from './helpers/ios-actions';

const verifyReceiptUrlSB = 'https://sandbox.itunes.apple.com/verifyReceipt';
const verifyReceiptUrl = 'https://buy.itunes.apple.com/verifyReceipt';

router.post('/', async (req: any, res: any, next: any) => {

    const { environment, notification_type, auto_renew_status, auto_renew_status_change_date_pst, unified_receipt } = req.body;

    //get the most recent receipt
    //BE AWARE OF ENVIRONMENT

    if (!unified_receipt || !unified_receipt.latest_receipt) {
        console.log('no receipt')
        return res.send()
    }

    if (unified_receipt.status !== 0) {
        console.log('Invalid receipt')
        return res.send()
    }

    const fetchUserData = await iosHelperActions.fetchUserData(unified_receipt.latest_receipt)

    if (!fetchUserData) return res.send()

    //Don't need to handle refunds or cancelations. User will have access for the rest of the subscription period.

    switch (notification_type) {
        case 'DID_RENEW':
            //Indicates that a customer’s subscription has successfully auto-renewed for a new transaction period. Provide the customer with access to the subscription's content or service.
            iosHelperActions.onRenewal(fetchUserData.doc, fetchUserData.latest_receipt_info.expires_date_ms);
            break;
        case 'INITIAL_BUY':
        //Handle Initial buy when user completes the transaction on the client
        case 'DID_CHANGE_RENEWAL_STATUS':
        //cancel auto renewal
        //check expires_date to determine if the user unsubscribed or resubscribed
        //This might not be necessary
        case 'DID_FAIL_TO_RENEW':
        //billing issue with apple
        case 'DID_RECOVER':
        //recover billing

    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
})


export default router;
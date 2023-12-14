import express from "express";
const router = require('express').Router();
import Subscriptions, { SubscriptionProps, SubTypes } from '../../../collections/subscriptions';
import errorCatch from "../../../utils/error-catch";
import IosHelpers from '../helpers/ios-actions'
import User from '../../../collections/users';

router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const { uid } = req.headers as { uid: string };
    const { transactionReceipt, originalOrderId, productId } = req.body;

    User.findOneAndUpdate({ uid: uid }, { subscriptionType: productId, subscriptionUpdate: new Date() }, { new: true })
        .then((doc) => {
            if (doc) {
                res.send(doc)
            } else {
                res.status(404).send("Failed to update subscription.")
            }
        })
        .catch((err) => errorCatch(err, res, next))


    // const reqBody = {
    //     "receipt-data": transactionReceipt,
    //     "password": process.env.RECEIPT_VALIDATION_CODE,
    //     "exclude-hold-transactions": true
    // }
    // //validate receipt
    // const receipt = await IosHelpers.validateReceipt(reqBody);

    // if (!receipt) return res.status(401).send("Could not verify receipt information.");

    // //user expire
    // //get the transaction id from the lastest receipt info
    // const { latest_receipt_info } = receipt as { latest_receipt_info: any };

    // if (!latest_receipt_info || latest_receipt_info.length < 1) {
    //     console.log('no receipt info')
    //     return res.send();
    // }

    // const { expires_date_ms } = latest_receipt_info[0];

    // if (!expires_date_ms) return res.send();

    // const invoiceDate = new Date(parseInt(expires_date_ms));
    // const newPeriodEnd = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, invoiceDate.getDate() + 2);

    // Subscriptions.findOneAndUpdate({ uid, original_transaction_id: originalOrderId }, {
    //     product_id: productId,
    //     original_transaction_id: originalOrderId,
    //     currentPeriodEnd: newPeriodEnd,
    //     subStatus: 'active',
    //     subType: SubTypes.monthly
    // }, { new: true, upsert: true })
    //     .then((doc) => res.send(doc.toObject()))
    //     .catch(err => errorCatch(err, res, next))
});

export default router;
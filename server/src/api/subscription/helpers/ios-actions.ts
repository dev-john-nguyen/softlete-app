import Stripe from 'stripe';
import Subscriptions, { SubscriptionProps, SubTypes } from '../../../collections/subscriptions';
import { Document, Types } from 'mongoose';
import axios from 'axios';

const verifyReceiptUrlSB = 'https://sandbox.itunes.apple.com/verifyReceipt';
const verifyReceiptUrl = 'https://buy.itunes.apple.com/verifyReceipt';

interface ReqBodyProps {
    "receipt-data": string;
    "password": string | undefined;
    "exclude-hold-transactions": boolean;
}

const validateReceipt = async (reqBody: ReqBodyProps) => {
    //live environment
    return axios.post(verifyReceiptUrl, reqBody)
        .then(({ data }: { data: any }) => {
            if (data.status && data.status === 21007) {
                return axios.post(verifyReceiptUrlSB, reqBody).then(({ data }) => data)
            }
            return data
        })
        .catch(err => {
            //both environments failed
            console.log(err)
        })
}

const fetchUserData = async (latest_receipt: string) => {
    const reqBody = {
        "receipt-data": latest_receipt,
        "password": process.env.RECEIPT_VALIDATION_CODE,
        "exclude-hold-transactions": true
    }

    //live environment
    const receipt = await validateReceipt(reqBody)

    if (!receipt) {
        console.log('no receipt')
        return;
    }

    //user expire
    //get the transaction id from the lastest receipt info
    const { latest_receipt_info } = receipt as { latest_receipt_info: any };

    if (!latest_receipt_info || latest_receipt_info.length < 1) {
        console.log('no receipt info')
        return;
    }


    const { product_id, original_transaction_id, expires_date_ms } = latest_receipt_info[0];

    //find user subscription doc
    const userSubDoc = await Subscriptions.findOneAndUpdate({ product_id, original_transaction_id }, { product_id, original_transaction_id }, { upsert: true, new: true }).catch(err => {
        console.log(err)
    })

    if (!userSubDoc) {
        console.log("Couldn't find user with this subscription")
        return;
    }

    return {
        doc: userSubDoc,
        latest_receipt_info
    }
}

const onRenewal = async (userSubDoc: (Document<any, any, SubscriptionProps> & SubscriptionProps & {
    _id: Types.ObjectId;
}), expires_date_ms: string) => {
    //add a month a 2 days to currentPeriodEnd
    const invoiceDate = new Date(parseInt(expires_date_ms));
    const newPeriodEnd = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, invoiceDate.getDate() + 2)

    userSubDoc.currentPeriodEnd = newPeriodEnd
    userSubDoc.subStatus = 'active'
    userSubDoc.save()
}

export default {
    onRenewal,
    fetchUserData,
    validateReceipt
}
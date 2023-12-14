import mongoose from 'mongoose';
import _ from 'lodash';

export interface SubscriptionProps {
    _id: mongoose.Types.ObjectId,
    uid: string;
    subType: SubTypes;
    subPrice: number | null;
    subStatus: string;
    stripeSubId: string;
    stripeCustomerId: string;
    lastPayDate: Date;
    currentPeriodEnd: Date;
    product_id: string;
    original_transaction_id: string;
}

export enum SubTypes {
    free = 'free',
    monthly = 'monthly',
}



//mongoose default uid will be retrieverd from firebase
const subscriptionSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100
    },
    product_id: {
        type: String
    },
    original_transaction_id: {
        type: String,
        unique: true
    },
    currentPeriodEnd: {
        type: Date
    },
    subType: {
        type: String,
        enum: SubTypes,
        default: SubTypes.free
    },
    subPrice: {
        type: Number,
    },
    lastPayDate: {
        type: Date
    },
    subStatus: {
        type: String,
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubId: {
        type: String
    }
}, {
    timestamps: true
})

export default mongoose.model<SubscriptionProps>("Subscription", subscriptionSchema);
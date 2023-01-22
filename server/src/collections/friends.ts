import mongoose from 'mongoose';
import { Categories } from './types';

export interface FriendsSchemaProps {
    _id: mongoose.Types.ObjectId;
    users: string[];
    lastModUid: string;
    status: FriendStatus
}

export enum FriendStatus {
    pending = 'pending',
    accepted = 'accepted',
    denied = 'denied'
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const friendsSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: FriendStatus,
        default: FriendStatus.pending
    },
    users: {
        type: [String],
        required: true,
        validate: [(val: string[]) => {
            return val.length === 2
        }, 'Must be two users in a friend doc.']
    },
    lastModUid: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model<FriendsSchemaProps>("Friend", friendsSchema);
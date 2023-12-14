import mongoose from 'mongoose';
import _ from 'lodash';

export interface UserProps {
    uid: string;
    admin: Boolean;
    subscriptionType?: string;
    subscriptionUpdate?: Date;
    imageUri: string;
    email: string;
    name: string;
    birthDate: string;
    username: string;
    isPrivate: Boolean;
    bio: string;
    notificationToken: string;
    pinExercises: { exerciseUid: string }[];
    blockUids: string[];
    deactivated?: Boolean;
}

export const profileFilter = {
    username: 1,
    athlete: 1,
    name: 1,
    imageUri: 1,
    isPrivate: 1,
    bio: 1,
    uid: 1,
    pinExercises: 1
}

//mongoose default uid will be retrieverd from firebase
const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100
    },
    subscriptionType: {
        type: String,
        default: 'softlete_0.00_1m'
    },
    subscriptionUpdate: {
        type: Date
    },
    admin: {
        type: Boolean,
        default: false
    },
    imageUri: {
        type: String,
        default: ''
    },
    athlete: {
        type: String,
        default: 'athlete',
        maxlength: 100
    },
    email: {
        type: String,
        maxlength: 300
    },
    name: {
        type: String,
        lowercase: true,
        maxlength: 200
    },
    birthDate: {
        type: Date,
    },
    username: {
        type: String,
        lowercase: true,
        maxlength: 200
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    },
    bio: {
        type: String,
        default: '',
        maxlength: 400
    },
    notificationToken: {
        type: String
    },
    pinExercises: {
        default: [],
        type: [{
            exerciseUid: {
                type: mongoose.Types.ObjectId
            },
        }],
        validate: [(val: { exerciseUid: string }[]) => {
            return val.length <= 10
        }, 'exceeds the limit of 10']
    },
    blockUids: {
        default: [],
        type: [String]
    },
    deactivated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model<UserProps>("User", userSchema);
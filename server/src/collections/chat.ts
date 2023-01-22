import mongoose from 'mongoose';

export interface ChatSchemaProps {
    _id: mongoose.Types.ObjectId;
    owner: string;
    users: string[];
    recentMsg: string;
    recentUser: string;
    recentTime: Date;
    read: boolean;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const chatSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true
    },
    recentMsg: {
        type: String
    },
    recentUser: {
        type: String
    },
    recentTime: {
        type: Date
    },
    read: {
        type: Boolean
    }
}, {
    timestamps: true
})

export default mongoose.model<ChatSchemaProps>("Chat", chatSchema);
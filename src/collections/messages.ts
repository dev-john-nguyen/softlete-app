import mongoose from 'mongoose';

export interface MessageSchemaProps {
    _id: mongoose.Types.ObjectId;
    sender: string;
    message: string;
    createdAt: Date;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
    }
}, {
    timestamps: true
})

export default mongoose.model<MessageSchemaProps>("Message", messageSchema);
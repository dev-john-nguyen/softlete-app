import mongoose from 'mongoose';

export interface ContactProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    message: string;
}

const contactSchema: mongoose.Schema<ContactProps> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model<ContactProps>("Contact", contactSchema);
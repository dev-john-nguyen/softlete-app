import mongoose from 'mongoose';

export interface FeedbackProps {
    _id?: mongoose.Types.ObjectId;
    ui: string;
    valueRating: number;
    comments?: string;
    advice?: string;
    bugs?: string;
}

const feedbackSchema: mongoose.Schema<FeedbackProps> = new mongoose.Schema({
    ui: {
        type: String,
        required: true
    },
    valueRating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
    },
    advice: {
        type: String,
    },
    bugs: {
        type: String,
    }
}, {
    timestamps: true
})

export default mongoose.model<FeedbackProps>("Feedback", feedbackSchema);
import mongoose from 'mongoose';

export interface BugsProps {
    _id?: mongoose.Types.ObjectId;
    userUid: string;
    description: string;
    type: string;
}

const bugsSchema: mongoose.Schema<BugsProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 1000
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    type: {
        type: String,
        maxLength: 200
    }
}, {
    timestamps: true
})

export default mongoose.model<BugsProps>("Bug", bugsSchema);
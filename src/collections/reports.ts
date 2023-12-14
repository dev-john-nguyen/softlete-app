import mongoose from 'mongoose';

export interface ReportProps {
    _id?: mongoose.Types.ObjectId;
    reportedUserUid: string;
    userUid: string;
    description: string;
    type: string;
    typeId: string;
}

const reportSchema: mongoose.Schema<ReportProps> = new mongoose.Schema({
    reportedUserUid: {
        type: String,
        required: true,
        maxLength: 1000
    },
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
    },
    typeId: {
        type: String,
        maxLength: 200
    }
}, {
    timestamps: true
})

export default mongoose.model<ReportProps>("Report", reportSchema);
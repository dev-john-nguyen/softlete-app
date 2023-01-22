import mongoose from 'mongoose';

export interface ProgramTemplateProps {
    _id?: mongoose.Types.ObjectId;
    userUid: string;
    name: string;
    description: string;
    isPrivate: boolean;
    date: Date;
    imageUri?: string;
    accessCodes: string[];
    likeUids?: string[];
}

const programTemplateSchema: mongoose.Schema<ProgramTemplateProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        maxLength: 200
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    },
    imageUri: {
        type: String,
        maxLength: 500
    },
    accessCodes: {
        type: [String],
        validate: [(val: String[]) => {
            return val.length <= 100
        }, 'exceeds the limit of 100'],
        default: []
    },
    likeUids: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

export default mongoose.model<ProgramTemplateProps>("Program-Template", programTemplateSchema);
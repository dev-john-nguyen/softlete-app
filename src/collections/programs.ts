import mongoose from 'mongoose';

export interface ProgramProps {
    _id?: mongoose.Types.ObjectId;
    programTemplateUid: typeof mongoose.Types.ObjectId;
    startDate: Date;
    userUid: string;
    name: string;
    description: string;
    isPrivate: boolean;
    date: Date;
}

const programSchema: mongoose.Schema<ProgramProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    programTemplateUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        required: true
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
    }
}, {
    timestamps: true
})

export default mongoose.model<ProgramProps>("Program", programSchema);
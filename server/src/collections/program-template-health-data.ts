import mongoose from 'mongoose';

export interface ProgramTemplateHealthDataProps {
    _id: mongoose.Types.ObjectId;
    userUid: string;
    activityName?: string;
    sourceName?: string;
    duration: number;
    calories?: number;
    distance?: number;
    type?: string;
    activityId?: string;
    heartRates?: number[];
    programTemplateUid: mongoose.Types.ObjectId;
    programWorkoutUid: mongoose.Types.ObjectId;
}

const programTemplateHealthData = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100,
    },
    programTemplateUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    programWorkoutUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    activityId: {
        type: String,
    },
    activityName: {
        type: String
    },
    sourceName: {
        type: String
    },
    duration: {
        type: Number,
        default: 0
    },
    calories: {
        type: Number,
        default: 0
    },
    distance: {
        type: Number,
        default: 0
    },
    heartRates: {
        type: [Number],
        default: []
    }
}, {
    timestamps: true
})

export default mongoose.model<ProgramTemplateHealthDataProps>("Program-Template-Health-Data", programTemplateHealthData);
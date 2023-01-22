import mongoose from 'mongoose';
import { WorkoutTypes } from './workouts';

export interface ProgramTemplateWorkoutsProps {
    _id?: mongoose.Types.ObjectId;
    userUid: string;
    programTemplateUid: typeof mongoose.Types.ObjectId;
    name: string;
    description: string;
    comment: string;
    daysFromStart: number;
    type: string;
}

const programTemplateWorkoutSchema: mongoose.Schema<ProgramTemplateWorkoutsProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    type: {
        type: String,
        maxLength: 200,
        default: WorkoutTypes.TraditionalStrengthTraining
    },
    programTemplateUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    daysFromStart: {
        type: Number,
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
        maxLength: 200
    },
    comment: {
        type: String,
        maxLength: 200
    }
}, {
    timestamps: true
})

export default mongoose.model<ProgramTemplateWorkoutsProps>("Program-Template-Workout", programTemplateWorkoutSchema);
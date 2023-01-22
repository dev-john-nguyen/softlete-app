import mongoose from 'mongoose';

export interface ProgramTemplateExercisesProps {
    _id: mongoose.Types.ObjectId;
    remove?: boolean;
    data: ProgramExerciseDataProps[];
    userUid: mongoose.Types.ObjectId;
    exerciseUid: mongoose.Types.ObjectId;
    programWorkoutUid: mongoose.Types.ObjectId;
    programTemplateUid: mongoose.Types.ObjectId;
    group: Number
    order: Number
    sets: Number
    reps: Number
    measurement: String
    comments: String
    track: Boolean
    calcRef?: Number
}

export interface ProgramExerciseDataProps {
    reps: Number,
    predictVal: mongoose.Types.Decimal128,
    pct: Number,
    warmup: Boolean
}


const programTemplateExercisesSchema = new mongoose.Schema({
    data: {
        type: [{
            reps: Number,
            predictVal: {
                type: mongoose.Types.Decimal128,
                default: 0
            },
            pct: {
                type: Number,
                default: 100,
                min: 0,
                max: 100
            },
            warmup: {
                type: Boolean,
                default: false
            }
        }],
        validate: [(val: ProgramExerciseDataProps[]) => val.length <= 50, 'exceeds the data limit of 50'],
        required: true
    },
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    programWorkoutUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    programTemplateUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    exerciseUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    calcRef: {
        type: mongoose.Types.Decimal128
    },
    group: {
        type: Number,
        required: true,
        max: 100
    },
    order: {
        type: Number,
        required: true,
        max: 100
    },
    comments: {
        type: String
    },
}, {
    timestamps: true
})

export default mongoose.model<ProgramTemplateExercisesProps>("Program-Template-Exercise", programTemplateExercisesSchema);
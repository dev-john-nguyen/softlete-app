import mongoose from 'mongoose';

export interface WorkoutExercisesProps {
    _id: mongoose.Types.ObjectId;
    date: Date | string;
    data: WorkoutExerciseDataProps[];
    userUid: mongoose.Types.ObjectId;
    exerciseUid: mongoose.Types.ObjectId;
    workoutUid: mongoose.Types.ObjectId;
    group: Number
    order: Number
    sets: Number
    reps: Number
    measurement: String,
    comments: String
    track: Boolean,
    programUid?: mongoose.Types.ObjectId;
    calcRef?: Number
}

export interface WorkoutExerciseDataProps {
    reps: Number,
    performVal: mongoose.Types.Decimal128,
    predictVal: mongoose.Types.Decimal128,
    pct: Number,
    warmup: Boolean
}

const workoutExercisesSchema = new mongoose.Schema({
    data: {
        type: [{
            reps: Number,
            performVal: {
                type: mongoose.Types.Decimal128,
                default: 0
            },
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
        validate: [(val: WorkoutExerciseDataProps[]) => val.length <= 50, 'exceeds the data limit of 50'],
        required: true,
        default: []
    },
    date: {
        type: Date,
        required: true
    },
    programUid: {
        type: mongoose.Types.ObjectId,
    },
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    workoutUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    exerciseUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    calcRef: {
        type: mongoose.Types.Decimal128,
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
    }
}, {
    timestamps: true
})

export default mongoose.model<WorkoutExercisesProps>("Workout-Exercise", workoutExercisesSchema);
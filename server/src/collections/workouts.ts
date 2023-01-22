import mongoose from 'mongoose';

export interface WorkoutProps {
    _id?: mongoose.Types.ObjectId;
    type: string;
    userUid: string;
    programUid?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    isPrivate: boolean;
    comment: string;
    date: Date;
    strainRating?: Number;
    reflection?: string;
    status: string;
    likeUids?: string[];
    imageId?: string;
    sentNotification?: boolean;
    localImageUri?: string;
}

export enum WorkoutTypes {
    TraditionalStrengthTraining = "TraditionalStrengthTraining",
    Cycling = "Cycling",
    Swimming = "Swimming",
    Yoga = "Yoga",
    Walking = "Walking",
    Hiking = "Hiking",
    Activity = "Activity"
}


export enum WorkoutStatus {
    pending = 'pending',
    inProgress = 'inProgress',
    completed = 'completed'
}

const workoutSchema: mongoose.Schema<WorkoutProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100,
    },
    programUid: {
        type: mongoose.Types.ObjectId,
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: WorkoutStatus,
        default: WorkoutStatus.pending
    },
    type: {
        type: String,
        maxLength: 200,
        default: WorkoutTypes.TraditionalStrengthTraining
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 100
    },
    description: {
        type: String,
        maxLength: 100
    },
    comment: {
        type: String,
        maxLength: 200
    },
    reflection: {
        type: String,
        maxLength: 500
    },
    isPrivate: {
        type: Boolean
    },
    strainRating: {
        type: Number,
        max: 5
    },
    likeUids: {
        type: [String],
        default: []
    },
    imageId: {
        type: String
    },
    localImageUri: {
        type: String
    },
    sentNotification: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model<WorkoutProps>("Workout", workoutSchema);
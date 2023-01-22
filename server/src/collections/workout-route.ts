import mongoose from 'mongoose';
import { LocationProps } from './types';

export interface WorkoutRouteProps {
    _id: mongoose.Types.ObjectId
    activityId?: String
    userUid: String
    locations: LocationProps[]
}

const workoutRouteSchema = new mongoose.Schema({
    workoutUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    activityId: {
        type: String,
        maxlength: 200
    },
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    locations: {
        type: [{
            latitude: Number,
            longitude: Number,
            altitude: Number,
            timestamp: String,
            speed: Number,
            speedAccuracy: Number
        }]
    }
}, {
    timestamps: true
})

export default mongoose.model<WorkoutRouteProps>("Workout-Route", workoutRouteSchema);
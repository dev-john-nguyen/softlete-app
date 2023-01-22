import mongoose from 'mongoose';

export interface UserExerciseMeasurementProps {
    userUid: String;
    exerciseUid: mongoose.Types.ObjectId;
    isSoftlete: boolean;
    measCat: MeasCats;
    measSubCat: MeasSubCats;
}

export enum MeasCats {
    weight = 'weight',
    distance = 'distance',
    time = 'time',
    none = 'none'
}

export enum TimeCats {
    sec = 'seconds',
    min = 'minutes',
    hr = 'hour'
}

export enum DisCats {
    miles = 'miles',
    km = 'kilometers',
    in = 'inches',
    ft = 'feets',
    yds = 'yards',
    m = 'meters'
}

export enum WtCats {
    kg = 'kilograms',
    lb = 'pounds',
    ounce = 'ounces',
}

export enum MeasSubCats {
    kg = 'kilograms',
    lb = 'pounds',
    ounce = 'ounces',

    miles = 'miles',
    km = 'kilometers',
    in = 'inches',
    ft = 'feets',
    yds = 'yards',
    m = 'meters',

    sec = 'seconds',
    min = 'minutes',
    hr = 'hour',

    none = 'none'
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const userExerciseMeasurementSchema = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    exerciseUid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isSoftlete: {
        type: Boolean,
        required: true,
        default: false
    },
    measCat: {
        type: String,
        required: true,
        enum: MeasCats,
        default: MeasCats.weight
    },
    measSubCat: {
        type: String,
        required: true,
        enum: MeasSubCats,
        default: MeasSubCats.none
    }
}, {
    timestamps: true
})

export default mongoose.model<UserExerciseMeasurementProps>("User-Exercise-Measurement", userExerciseMeasurementSchema);
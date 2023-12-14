import mongoose from 'mongoose';

export interface VideoSchemaProps {
    userUid: string;
    url: string;
    videoId: string;
    thumbnail: string;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const videoSchema = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    url: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        maxLength: 20,
        unique: true,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model<VideoSchemaProps>("videos", videoSchema);
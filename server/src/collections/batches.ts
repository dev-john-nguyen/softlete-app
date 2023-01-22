import mongoose from 'mongoose';

export interface BatchesProps {
    _id?: mongoose.Types.ObjectId;
    userUid: string;
    woImageBatch: [{
        imageId: string;
        base64: string;
        workoutUid?: string;
        url?: string;
    }],
    exVideoBatch: [{
        exerciseUid?: string;
        videoId: string;
        path?: string;
        localUrl: string;
        compressedUrl?: string;
        url?: string;
        thumbnail?: string;
        localThumbnail: string;
        admin?: boolean;
        remove?: boolean;
    }]
}

const batchesSchema: mongoose.Schema<BatchesProps> = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 1000
    },
    woImageBatch: [{
        imageId: String,
        base64: String,
        workoutUid: String,
        url: String,
    }],
    exVideoBatch: [{
        exerciseUid: String,
        videoId: String,
        path: String,
        localUrl: String,
        compressedUrl: String,
        url: String,
        thumbnail: String,
        localThumbnail: String,
        admin: Boolean,
        remove: Boolean,
    }],
}, {
    timestamps: true
})

export default mongoose.model<BatchesProps>("Batches", batchesSchema);
import mongoose from 'mongoose';

export interface ImagesSchemaProps {
    userUid: string;
    url: string;
    imageId: string;
}

//exerciseSchema is for all exercises that can be access from anywhere
//all exercises are u
const ImagesSchema = new mongoose.Schema({
    userUid: {
        type: String,
        required: true,
        maxLength: 100
    },
    url: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

export default mongoose.model<ImagesSchemaProps>("images", ImagesSchema);
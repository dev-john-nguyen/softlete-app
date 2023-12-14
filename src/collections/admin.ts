import mongoose from 'mongoose';
import { Categories } from './types';

export interface AdminSchemaProps {
    uid: string;
    role: string;
    name: string;
}

const AdminSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model<AdminSchemaProps>("Admin", AdminSchema);
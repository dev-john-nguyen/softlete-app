import mongoose from 'mongoose';

export interface MuscleGroupProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
}

const muscleGroupSchema: mongoose.Schema<MuscleGroupProps> = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 500
    }
}, {
    timestamps: true
})

export default mongoose.model<MuscleGroupProps>("Muscle-Group", muscleGroupSchema);
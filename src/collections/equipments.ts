import mongoose from 'mongoose';

export interface EquipmentProps {
    _id?: mongoose.Types.ObjectId;
    name: string
}

const equipmentSchema: mongoose.Schema<EquipmentProps> = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 500
    }
}, {
    timestamps: true
})

export default mongoose.model<EquipmentProps>("Equipment", equipmentSchema);
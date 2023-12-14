import mongoose from 'mongoose';

export interface NotificationProps {
    _id?: mongoose.Types.ObjectId;
    uid: string;
    date?: Date;
    title?: string;
    body: string;
    data?: any;
    notificationType?: NotificationTypes;
}

export enum NotificationTypes {
    LIKE_WORKOUT = 'LIKE_WORKOUT',
    WORKOUT_UPDATE = 'WORKOUT_UPDATE',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    PROGRAM_ACCESSED = 'PROGRAM_ACCESSED',
    LIKE_PROGRAM = 'LIKE_PROGRAM',
    NEW_MESSAGE = 'NEW_MESSAGE'
}

const notificationSchema: mongoose.Schema<NotificationProps> = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    title: {
        type: String
    },
    body: {
        type: String,
    },
    notificationType: {
        type: String,
        enum: NotificationTypes
    },
    data: mongoose.SchemaTypes.Mixed
}, {
    timestamps: true
})

export default mongoose.model<NotificationProps>("Notification", notificationSchema);
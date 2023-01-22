import { AthleteProfileProps } from "../athletes/types";

export interface NotificationRootProps {
    notifications: NotificationProps[]
}

export interface NotificationProps {
    _id?: string;
    date: string;
    createdAt: string;
    title?: string;
    body: string;
    notificationType: NotificationTypes;
    data?: {
        senderProps?: AthleteProfileProps;
        workoutUid?: string;
        chatId?: string;
        [key: string]: any;
    };
}

export enum NotificationTypes {
    LIKE_WORKOUT = 'LIKE_WORKOUT',
    WORKOUT_UPDATE = 'WORKOUT_UPDATE',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    PROGRAM_ACCESSED = 'PROGRAM_ACCESSED',
    LIKE_PROGRAM = 'LIKE_PROGRAM',
    VIDEO_UPLOAD_ERROR = 'VIDEO_UPLOAD_ERROR',
    IMAGE_UPLOAD_ERROR = 'IMAGE_UPLOAD_ERROR',
    NEW_MESSAGE = 'NEW_MESSAGE'
}


export interface NotificationActionProps {
    fetchNotifications: () => Promise<void>
    processNotification: (screen: string, title?: string, body?: string, data?: { [key: string]: string }) => void;
}
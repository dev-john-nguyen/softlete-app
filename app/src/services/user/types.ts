import { AthleteProfileProps } from "../athletes/types";
import { PinExerciseProps } from "../misc/types";

export interface UserProps extends ProfileProps, ImageProps {
    name: string;
    uid: string;
    email: string;
    birthDate: Date;
    username: string;
    token: string;
    pinExercises: PinExerciseProps[];
    customs: CustomsProps;
    friends: FriendProps[];
    blockUids: string[];
    subscriptionType: string;
    subscriptionUpdate: string;
    product_id?: string;
    original_transaction_id?: string;
    currentPeriodEnd?: string;
    notificationToken?: string;
    admin?: boolean;
    createdAt?: string;
}

export interface SubscriptionProps {
    _id: string,
    uid: string;
    subType: string;
    subPrice: number | null;
    subStatus: string;
    stripeSubId: string;
    stripeCustomerId: string;
    lastPayDate: string;
    currentPeriodEnd: string;
    product_id: string;
    original_transaction_id: string;
}

export const profileKeys = ['name', 'age', 'athlete', 'bio', 'isPrivate'];


export enum FriendStatus {
    pending = 'pending',
    accepted = 'accepted',
    denied = 'denied'
}

export interface FriendProps {
    _id: string;
    lastModUid: string;
    users: string[];
    usersProps?: AthleteProfileProps[],
    status: FriendStatus;
    updatedAt: string;
}

export interface ProfileProps {
    name: string;
    athlete: string;
    bio: string;
    isPrivate: boolean;
    imageUri?: string;
}

export interface ImageProps {
    uri?: string;
    base64?: string;
}

export interface CustomsProps {
    autoCircuit: boolean;
}

export interface RegisterUserProps {
    email: string;
    password: string;
    username: string;
    name: string;
}

export interface UserActionProps {
    updateProfile: (data: ProfileProps, base64: string, callback: (status: string) => void) => Promise<void | undefined>;
    uploadProfileImage: (base64: string) => Promise<void>;
    updatePinExercises: (pinExercise: PinExerciseProps, pin: boolean) => Promise<void>;
    getFriends: () => Promise<void>;
    handleSubscriptionPurchased: (transactionReceipt: string, originalOrderId: string, productId: string) => Promise<void>
    registerUser: (username: string, name: string) => Promise<void>;
    handleBlockUser: (userUid: string, block: boolean) => Promise<void>;
}
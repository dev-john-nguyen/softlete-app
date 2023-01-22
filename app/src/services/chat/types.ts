import { AthleteProfileProps } from "../athletes/types";

export interface ChatRootProps {
    chats: ChatProps[];
    curChat: ChatProps;
}

export interface ChatProps {
    _id: string;
    owner: string;
    users: string[];
    usersProps?: AthleteProfileProps[];
    messages: MessageProps[];
    recentMsg?: string;
    recentUser?: string;
    recentTime?: string;
    read?: boolean;
    updatedAt: string;
}

export interface MessageProps {
    _id: string;
    chatId: string;
    sender: string;
    senderProps?: AthleteProfileProps;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatActionProps {
    initConv: (userUid: string, msg: string) => Promise<void>;
    sendMessage: (chatId: string, msg: string) => Promise<void | {
        message: MessageProps;
        chat: ChatProps;
    } | undefined>;
    getCurChat: (userUid: string, chatId: string) => Promise<ChatProps | undefined>;
    fetchChat: (userUid: string, chatId: string) => Promise<void | ChatProps>;
    getChats: () => Promise<void>;
    removeChat: (chatId: string) => Promise<void>;
}
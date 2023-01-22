import _ from "lodash";
import { ChatProps, MessageProps } from "./types";

export const findChatAndUpdateMostRecent = (stateChats: ChatProps[], message: MessageProps, chat: ChatProps) => {
    const index = stateChats.findIndex(chat => chat._id === message.chatId);

    if (index > -1) {
        stateChats[index] = {
            ...stateChats[index],
            recentMsg: message.message,
            recentUser: message.sender,
            recentTime: chat.recentTime,
            read: false,
            messages: [...stateChats[index].messages, message],
            updatedAt: chat.updatedAt,
            usersProps: chat.usersProps ? chat.usersProps : stateChats[index].usersProps
        }
    } else {
        //add the chat if available
        if (chat) {
            stateChats.push({
                ...chat,
                messages: [message]
            })
        }
    }

    return [...stateChats]
}

export const insertMessageIntoCurChat = (curChat: ChatProps | undefined, message: MessageProps) => {
    if (!curChat || curChat._id !== message.chatId) return curChat;

    return {
        ...curChat,
        messages: _.uniqBy([...curChat.messages, message], '_id')
    }
}

export const findAndRemoveChat = (stateChats: ChatProps[], chatId: string) => {
    const foundIndex = stateChats.findIndex(c => c._id === chatId);
    if (foundIndex > -1) {
        //splice
        stateChats.splice(foundIndex, 1)
    }
    return [...stateChats]
}
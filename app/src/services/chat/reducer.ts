import { ADD_CHAT, ADD_MESSAGE, SET_CUR_CHAT, ADD_RECENT_MESSAGE, REMOVE_CHAT } from "./actionTypes"
import { SIGNOUT_USER } from "../user/actionTypes";
import _ from "lodash";
import { ChatProps, MessageProps } from "./types";
import { findAndRemoveChat, findChatAndUpdateMostRecent, insertMessageIntoCurChat } from "./utils";

const INITIAL_STATE: any = {
    chats: [],
    curChat: undefined
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case REMOVE_CHAT:
            return {
                ...state,
                chats: findAndRemoveChat(state.chats, action.payload)
            }
        case ADD_RECENT_MESSAGE:
            //find the most chat and update most recent    
            return {
                ...state,
                chats: findChatAndUpdateMostRecent(state.chats, action.payload.message as MessageProps, action.payload.chat),
                curChat: insertMessageIntoCurChat(state.curChat, action.payload.message as MessageProps)
            }
        case SET_CUR_CHAT:
            return {
                ...state,
                curChat: action.payload as ChatProps
            }
        case ADD_CHAT:
            return {
                ...state,
                chats: _.uniqBy([...action.payload, ...state.chats], '_id')
            }
        case ADD_MESSAGE:
            return {
                ...state,
                chats: findChatAndUpdateMostRecent(state.chats, action.payload.message, action.payload.chat),
                curChat: insertMessageIntoCurChat(state.curChat, action.payload.message)
            }
        case SIGNOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
}
import { AppDispatch } from "../../../App";
import { ReducerProps } from "..";
import request from "../utils/request";
import PATHS from "../../utils/PATHS";
import { ADD_CHAT, ADD_MESSAGE, REMOVE_CHAT, SET_CUR_CHAT } from "./actionTypes";
import { ChatProps, MessageProps } from "./types";
import { getAthletesProfile } from "../athletes/actions";
import { setBanner } from "../banner/actions";
import { BannerTypes } from "../banner/types";


export const getChats = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request("GET", PATHS.chat.get, dispatch)
        .then(async ({ data: chats }: { data?: ChatProps[] }) => {
            if (chats) {

                for (let i = 0; i < chats.length; i++) {
                    chats[i] = await getChatUsersProfile(chats[i])(dispatch, getState)
                }

                dispatch({ type: ADD_CHAT, payload: chats.map(d => ({ ...d, messages: [] })) })
            }
        })
        .catch(err => console.log(err))
}

export const getChatUsersProfile = (chat: ChatProps) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const uidsToFetch: string[] = [];

    const { uid } = getState().user

    chat.users.forEach(u => {
        if (uid === u) return;
        uidsToFetch.push(u)
    })

    if (uidsToFetch.length > 0) {
        //need to store athlete profiles
        const fetchedProfiles = await getAthletesProfile(uidsToFetch)(dispatch, getState)

        if (fetchedProfiles) {
            chat.usersProps = fetchedProfiles
        }
    }

    return chat;
}

export const getCurChat = (userUid: string, chatId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //determine if the chat already exists
    if (!userUid && !chatId) return;
    //fetch chat
    const chat = await fetchChat(userUid, chatId)(dispatch, getState)

    if (chat) {
        dispatch({ type: SET_CUR_CHAT, payload: chat });
        return chat;
    }

    if (!userUid) {
        dispatch(setBanner(BannerTypes.warning, "Couldn't find chat. Please try refreshing the app."))
        dispatch({ type: SET_CUR_CHAT, payload: undefined })
        return;
    }

    return request("POST", PATHS.chat.create, dispatch, { userUid })
        .then(async ({ data }: { data?: { chat: ChatProps, message?: MessageProps } }) => {
            if (data) {

                let newChat: ChatProps = {
                    ...data.chat,
                    messages: data.message ? [data.message] : []
                } as ChatProps

                //insert profile
                newChat = await getChatUsersProfile(newChat)(dispatch, getState)

                dispatch({ type: ADD_CHAT, payload: [newChat] })
                dispatch({ type: SET_CUR_CHAT, payload: newChat })
                return newChat
            }
        })
        .catch(err => console.log(err))
}

export const fetchChat = (userUid: string, chatId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //determine if the chat already exists
    //Check if the chat was prefetched in state
    //cannot be both false
    if (!userUid && !chatId) return;

    return request("GET", PATHS.chat.fetch(userUid, chatId), dispatch)
        .then(async ({ data: chat }: { data?: ChatProps }) => {
            if (chat) {
                chat = await getChatUsersProfile(chat)(dispatch, getState)

                dispatch({
                    type: ADD_CHAT,
                    payload: [chat]
                })
                return chat
            }
        })
        .catch(err => console.log(err))
}

export const initConv = (userUid: string, msg: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request("POST", PATHS.chat.create, dispatch, { userUid, message: msg })
        .then(({ data }: { data?: { chat: ChatProps, message?: MessageProps } }) => {
            if (data) {
                dispatch({
                    type: ADD_CHAT,
                    payload: [{
                        ...data.chat,
                        messages: data.message ? [data.message] : []
                    }]
                })
            }
        })
        .catch(err => console.log(err))
}

export const sendMessage = (chatId: string, msg: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    return request("POST", PATHS.chat.messages.send, dispatch, { chatId, message: msg })
        .then(async ({ data }: { data?: { message: MessageProps, chat: ChatProps } }) => {
            if (data) {
                dispatch({ type: ADD_MESSAGE, payload: data })
                return data
            }
        })
        .catch(err => console.log(err))
}

export const removeChat = (chatId: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    request("POST", PATHS.chat.remove, dispatch, { chatId })
        .then(() => {
            dispatch({ type: REMOVE_CHAT, payload: chatId })
        })
        .catch(err => console.log(err))
}

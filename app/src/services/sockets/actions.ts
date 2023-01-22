import { AppDispatch } from "../../../App";
import { ReducerProps } from "..";
import { ChatProps, MessageProps } from "../chat/types";
import socket from "./socket";
import { ADD_MESSAGE, REMOVE_CHAT } from "../chat/actionTypes";
import { FriendProps } from "../user/types";
import { INSERT_FRIENDS } from "../user/actionTypes";
import { getAthletesProfile } from "../athletes/actions";
import { logout } from "../user/actions";
import { setBanner } from "../banner/actions";
import { BannerTypes } from "../banner/types";
import _ from "lodash";

export const initSockets = () => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    const { uid } = getState().user;

    socket.emit("init", { uid: uid });

    socket.on('message', (chat: { message: MessageProps, chat: ChatProps }) => {
        handleInboundMessage(chat, uid)(dispatch, getState)
    })

    socket.on('remove-chat', ({ chatId }: { chatId: string }) => {
        dispatch({ type: REMOVE_CHAT, payload: chatId })
    })

    socket.on('friend-request', (friendProps: FriendProps) => {
        handleInboundFriendRequest(friendProps, uid)(dispatch, getState)
    })

    socket.on("signout", (msg: string) => {
        logout()(dispatch)
        dispatch(setBanner(BannerTypes.warning, msg))
    })

    socket.on("connect", () => {
        console.log('connect')
    });

    socket.on("reconnect_error", (err) => {
        console.log(err)
    })

}

const handleInboundMessage = ({ message, chat }: { message: MessageProps, chat: ChatProps }, uid: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //check to see if chat already exists and if not update friends
    const { chats } = getState().chat;
    const found = chats.find(c => c._id === chat._id)

    if (!found) {
        //if it doesn't exists fetch the profile
        const uidToFetch = chat.users.find(u => u !== uid)
        if (uidToFetch) {
            const fetchedProfile = await getAthletesProfile([uidToFetch])(dispatch, getState);
            if (fetchedProfile) {
                chat.usersProps = fetchedProfile;
            }
        }
    }

    dispatch({ type: ADD_MESSAGE, payload: { message, chat } })
}


const handleInboundFriendRequest = (friendProps: FriendProps, uid: string) => async (dispatch: AppDispatch, getState: () => ReducerProps) => {
    //get all athletes
    const exists = getState().athletes.profiles.find(a => friendProps.users.find(u => a.uid === u))
    if (!exists) {
        //fetch for athelte
        const uidToFetch = friendProps.users.find(u => u !== uid)
        if (uidToFetch) {
            const fetchedProfile = await getAthletesProfile([uidToFetch])(dispatch, getState);
            if (fetchedProfile) {
                friendProps.usersProps = fetchedProfile
            }
        }
    }

    dispatch({ type: INSERT_FRIENDS, payload: [friendProps] })
}
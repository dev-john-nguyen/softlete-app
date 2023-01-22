import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ReducerProps } from '../../services';
import { UserProps } from '../../services/user/types';
import { MessageProps, ChatActionProps, ChatProps } from '../../services/chat/types';
import { getCurChat, sendMessage } from '../../services/chat/actions';
import StyleConstants from '../../components/tools/StyleConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageInput from '../../components/chat/MessageInput';
import { AthleteProfileProps } from '../../services/athletes/types';
import MessageProfile from '../../components/chat/MessageProfile';
import { AppDispatch } from '../../../App';
import { SET_CURRENT_ATHLETE } from '../../services/athletes/actionTypes';
import { NetworkStackScreens } from './types';
import AutoId from '../../utils/AutoId';
import ChatMessage from '../../components/chat/Message';
import { BannerTypes } from '../../services/banner/types';
import { setBanner } from '../../services/banner/actions';
import _ from 'lodash';


interface Props {
    user: UserProps;
    sendMessage: ChatActionProps['sendMessage'];
    getCurChat: ChatActionProps['getCurChat'];
    route: any;
    navigation: any;
    dispatch: AppDispatch;
    chats: ChatProps[];
}

const Message = ({ user, sendMessage, route, navigation, dispatch, getCurChat, chats }: Props) => {
    const [msgArr, setMsgArr] = useState<MessageProps[]>([]);
    const [athlete, setAthlete] = useState<AthleteProfileProps | undefined>();
    const [chat, setChat] = useState<ChatProps>()


    const onNavToProfile = () => {
        if (!athlete) return;
        dispatch({ type: SET_CURRENT_ATHLETE, payload: athlete })
        navigation.navigate(NetworkStackScreens.AthleteDashboard, { athlete })
    }

    const initState = useCallback(async () => {
        const { chatId, athleteUid } = route.params;

        const curChat = await getCurChat(athleteUid, chatId);

        if (curChat) {
            if (curChat.usersProps) {
                setAthlete(curChat.usersProps.find(u => u.uid !== user.uid))
            }
            setMsgArr([...curChat.messages].reverse())
            setChat(curChat)
        } else {
            dispatch(setBanner(BannerTypes.warning, "Sorry! Looks like we are having trouble with this chat."))
            navigation.goBack()
        }
    }, [route])

    useEffect(() => {
        const { chatId, athleteUid } = route.params;
        if (!chatId && !athleteUid) {
            if (navigation.canGoBack()) {
                navigation.goBack()
            } else {
                navigation.navigate(NetworkStackScreens.Chats)
            }
            return;
        }
        initState()
    }, [route])

    useEffect(() => {
        if (chat) {
            const curChat = chats.find(c => c._id === chat._id)
            if (curChat) setMsgArr(_.uniqBy([...curChat.messages], '_id').reverse())
        }
    }, [chats])

    const onSendMessage = (msg: string) => {
        if (!msg || !chat) return;

        const tempMsg: MessageProps = {
            _id: AutoId.newId(10),
            chatId: chat._id,
            sender: user.uid,
            message: msg,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString()
        }

        setMsgArr(msgs => [tempMsg, ...msgs]);

        sendMessage(chat._id, msg)
            .then((res) => {
                if (res) {
                    setMsgArr(msgs => {
                        const i = msgs.findIndex(m => m._id === tempMsg._id)
                        if (i > -1) {
                            msgs[i] = res.message
                        }
                        return [...msgs]
                    });
                }
            })
    }

    const renderItem = useCallback(({ item }: { item: MessageProps }) => {
        const isUser = item.sender === user.uid;
        return <ChatMessage isUser={isUser} message={item.message} />
    }, [msgArr])


    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
            <MessageProfile athlete={athlete} onPress={onNavToProfile} />
            <FlatList
                data={msgArr}
                keyExtractor={(item, index) => item._id ? item._id : index.toString()}
                renderItem={renderItem}
                initialNumToRender={50}
                inverted
            />
            <MessageInput
                onSendMessage={onSendMessage}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageContainer: {
        flexDirection: 'row',
        borderRadius: 100,
        padding: 15,
        paddingLeft: 20,
        paddingRight: 20,
        margin: StyleConstants.smallMargin,
        flexWrap: 'wrap'
    },
    message: {
        fontSize: StyleConstants.smallFont
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    user: state.user,
    chats: state.chat.chats
})

const mapDispatchToProps = (dispatch: any) => ({
    sendMessage: (chatId: string, msg: string) => dispatch(sendMessage(chatId, msg)),
    getCurChat: (userUid: string, chatId: string) => dispatch(getCurChat(userUid, chatId)),
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Message);
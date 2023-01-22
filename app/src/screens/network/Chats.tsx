import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { ChatProps, ChatActionProps } from '../../services/chat/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProps } from '../../services/user/types';
import { removeChat } from '../../services/chat/actions';
import ChatListItem from '../../components/chat/ListItem';
import { NetworkStackScreens } from './types';


interface Props {
    chats: ChatProps[];
    user: UserProps;
    navigation: any;
    removeChat: ChatActionProps['removeChat'];
    route: any
}


const Chats = ({ chats, user, navigation, removeChat, route }: Props) => {
    const [data, setData] = useState<ChatProps[]>([]);

    const onChatPress = async (chatId: string) => {
        navigation.push(NetworkStackScreens.Message, { chatId })
    }

    useEffect(() => {
        const chatfilter = chats.filter(c => (c.messages && c.messages.length > 0) || (c.recentMsg)).sort((a, b) => {
            if (a.recentTime && b.recentTime) {
                return new Date(b.recentTime).getTime() - new Date(a.recentTime).getTime()
            }
            return 0
        })

        setData(chatfilter)
    }, [chats])

    useEffect(() => {
        const { params } = route;
        if (params && params.chatId) {
            navigation.navigate(NetworkStackScreens.Message, { chatId: params.chatId })
        }
    }, [route])


    const renderItem = useCallback(({ item }: { item: ChatProps }) => {
        return <ChatListItem chat={item} user={user} onChatPress={onChatPress} onRemoveChat={removeChat} />
    }, [chats])

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']} >
            <FlatList
                data={data}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyExtractor={(item, index) => item._id ? item._id : index.toString()}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    chats: state.chat.chats,
    user: state.user
})

export default connect(mapStateToProps, { removeChat })(Chats);
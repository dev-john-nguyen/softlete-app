import React from 'react';
import { View, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { FriendProps, FriendStatus, UserProps } from '../services/user/types';
import { IndexStackList } from '../screens/types';
import { normalize } from '../utils/tools';
import BaseColors from '../utils/BaseColors';
import HomeSvg from '../assets/HomeSvg';
import { connect } from 'react-redux';
import { AppDispatch } from '../../App';;
import StyleConstants, { moderateScale } from './tools/StyleConstants';
import GearSvg from '../assets/GearSvg';
import SearchSvg from '../assets/SearchSvg';
import { HomeStackScreens } from '../screens/home/types';
import PeopleSvg from '../assets/PeopleSvg';
import LogoutSvg from '../assets/LogoutSvg';
import BellSvg from '../assets/BellSvg';
import MessageSvg from '../assets/MessageSvg';
import { ReducerProps } from '../services';
import { ChatProps } from '../services/chat/types';
import AdminSvg from '../assets/AdminSvg';
import HelpSvg from '../assets/HelpSvg';
import { NetworkStackScreens } from '../screens/network/types';
import BooksSvg from '../assets/FolderSvg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PersonAddSvg from '../assets/PersonAddSvg';
import DrawerProfile from './DrawerProfile';
import { goOffline, goOnline } from '../services/global/actions';
import GraphSvg from '../assets/GraphSvg';
import { ProgramStackScreens } from '../screens/program/types';
import SecondaryText from './elements/SecondaryText';


interface Props {
    drawerProps: any;
    user: UserProps;
    logout: () => void;
    chats: ChatProps[];
    friendRequests: FriendProps[];
    offline: boolean;
    goOffline: () => Promise<void>;
}


const CustomDrawerMenu = ({ drawerProps, user, logout, chats, friendRequests, offline, goOffline }: Props) => {
    const insets = useSafeAreaInsets();
    if (!user.token) {
        return <></>
    }

    const onNavigate = (stack: string) => {
        drawerProps.navigation.navigate({ name: stack, params: undefined })
    }

    const onNavToHome = () => {
        drawerProps.navigation.navigate(IndexStackList.HomeStack, {
            screen: HomeStackScreens.Home
        })
    }


    const onNavToTemplates = () => {
        if (offline) return;
        drawerProps.navigation.navigate(IndexStackList.ProgramStack)
    }

    const onNavToRequests = () => {
        if (offline) return;
        drawerProps.navigation.navigate(IndexStackList.NetworkStack, {
            screen: NetworkStackScreens.Notifications,
            params: { navFromMenu: true }
        })
    }

    const onNavToAthletes = () => !offline && drawerProps.navigation.navigate(IndexStackList.NetworkStack, {
        screen: NetworkStackScreens.SearchAthletes,
        params: { navFromMenu: true }
    })


    const onNavToFriends = () => !offline && drawerProps.navigation.navigate(IndexStackList.NetworkStack, {
        screen: NetworkStackScreens.Friends
    })

    const onNavToAdmin = () => drawerProps.navigation.navigate(IndexStackList.AdminStack)

    const onNavToChats = () => !offline && drawerProps.navigation.navigate(IndexStackList.NetworkStack, {
        screen: NetworkStackScreens.Chats,
        params: { navFromMenu: true }
    })


    const renderAmtUnreadMsgs = () => {
        const unread = chats.filter(c => c.recentUser && c.recentUser !== user.uid && !c.read).length
        if (unread) {
            return (
                <View style={styles.numContainer} />
            )
        }
    }

    const renderFriendRequests = () => {
        const request = friendRequests.filter(f => {
            if (f.status === FriendStatus.pending && f.lastModUid !== user.uid) return true
            return false
        }).length

        if (request) {
            return (
                <View style={styles.numContainer} />
            )
        }
    }

    const onSwitch = () => {
        if (offline) {
            drawerProps.navigation.navigate(HomeStackScreens.GoOnlineModal)
        } else {
            goOffline()
            drawerProps.navigation.navigate(HomeStackScreens.Home)
        }

    }


    const onLogout = () => {
        logout()
        drawerProps.navigation.closeDrawer();
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <DrawerProfile
                user={user}
                insets={insets}
                onSwitch={onSwitch}
                offline={offline}

            />
            <ScrollView style={{ flex: 1, marginTop: StyleConstants.smallMargin }}>

                <Pressable style={styles.itemContainer} onPress={onNavToHome}>
                    <View style={styles.icon}>
                        <HomeSvg strokeColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.itemText} bold>Home</SecondaryText>
                </Pressable>

                {
                    !offline && (
                        <>
                            <Pressable style={styles.itemContainer} onPress={onNavToRequests}>
                                <View style={styles.icon}>
                                    <BellSvg fillColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.itemText} bold>Activity</SecondaryText>
                                {renderFriendRequests()}
                            </Pressable>


                            {/* <Pressable style={styles.itemContainer} onPress={onNavToDataOverview}>
                                <View style={styles.icon}>
                                    <GraphSvg fillColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.itemText}>Overview</SecondaryText>
                            </Pressable> */}

                            {/* 
                            <Pressable style={styles.itemContainer} onPress={onNavToChats}>
                                <View style={styles.icon}>
                                    <MessageSvg strokeColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.itemText}>Inbox</SecondaryText>
                                {renderAmtUnreadMsgs()}
                            </Pressable> */}

                            <Pressable style={styles.itemContainer} onPress={onNavToAthletes}>
                                <View style={styles.icon}>
                                    <PeopleSvg strokeColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.itemText} bold>Athletes</SecondaryText>
                            </Pressable>


                            <Pressable style={styles.itemContainer} onPress={onNavToFriends}>
                                <View style={styles.icon}>
                                    <PersonAddSvg strokeColor={BaseColors.primary} />
                                </View>
                                <SecondaryText styles={styles.itemText} bold>Friends</SecondaryText>
                            </Pressable>
                        </>
                    )
                }

                {/* <Pressable style={styles.itemContainer} onPress={onNavToExerciseSearch}>
                    <View style={styles.icon}>
                        <SearchSvg strokeColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.itemText}>Exercises</SecondaryText>
                </Pressable> */}

                {
                    !offline && (
                        <Pressable style={styles.itemContainer} onPress={onNavToTemplates}>
                            <View style={styles.icon}>
                                <BooksSvg strokeColor={BaseColors.primary} />
                            </View>
                            <SecondaryText styles={styles.itemText} bold>Templates</SecondaryText>
                        </Pressable>
                    )
                }

                <Pressable style={styles.itemContainer} onPress={() => onNavigate(IndexStackList.SettingsStack)}>
                    <View style={styles.icon}>
                        <GearSvg fillColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.itemText} bold>Settings</SecondaryText>
                </Pressable>

                <Pressable style={styles.itemContainer} onPress={() => onNavigate(IndexStackList.HelpStack)}>
                    <View style={styles.icon}>
                        <HelpSvg fillColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.itemText} bold>Help</SecondaryText>
                </Pressable>



                {
                    user.admin && !offline && (
                        <Pressable style={styles.itemContainer} onPress={onNavToAdmin}>
                            <View style={styles.icon}>
                                <AdminSvg fillColor={BaseColors.primary} />
                            </View>
                            <SecondaryText styles={styles.itemText}>Admin</SecondaryText>
                        </Pressable>

                    )
                }

            </ScrollView>

            <View style={{
                alignSelf: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 5,
                paddingBottom: 10
            }}>
                {
                    user.token && (
                        <Pressable onPress={onLogout}>
                            <View style={{
                                width: normalize.width(15),
                                height: normalize.width(15)
                            }}>
                                <LogoutSvg strokeColor={BaseColors.primary} />
                            </View>
                        </Pressable>
                    )
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: BaseColors.white
    },
    logo: {
        height: normalize.width(10),
        width: normalize.width(10),
        alignSelf: 'center',
        marginBottom: StyleConstants.baseMargin,
        marginTop: StyleConstants.baseMargin
    },
    section: {
        width: '100%',
    },
    icon: {
        width: moderateScale(20),
        height: moderateScale(20)
    },
    itemText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.primary,
        marginLeft: 20,
    },
    itemContainer: {
        margin: StyleConstants.baseMargin,
        flexDirection: 'row',
        alignItems: 'center',
    },
    numContainer: {
        position: 'absolute',
        right: 0,
        alignSelf: 'center',
        zIndex: 100,
        backgroundColor: BaseColors.primary,
        borderRadius: 100,
        height: 10,
        width: 20
    },
})

const mapStateToProps = (state: ReducerProps) => ({
    chats: state.chat.chats,
    friendRequests: state.user.friends,
    offline: state.global.offline
})
export default connect(mapStateToProps, { goOffline, goOnline })(CustomDrawerMenu);
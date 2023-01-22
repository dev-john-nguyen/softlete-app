import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import { AthleteProfileProps } from '../../services/athletes/types';
import AthleteListPreview from '../../components/athletes/ListPreview';
import { SET_CURRENT_ATHLETE } from '../../services/athletes/actionTypes';
import { NetworkStackScreens } from './types';
import { UserProps, FriendStatus, FriendProps } from '../../services/user/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import _ from 'lodash';
import { FlatList } from 'react-native-gesture-handler';


interface Props {
    navigation: any;
    route: any;
    dispatch: AppDispatch;
    athletes: AthleteProfileProps[];
    athlete: AthleteProfileProps;
    user: UserProps;
}


const AthleteFriends = ({ dispatch, navigation, athletes, athlete, user, route }: Props) => {
    const [friends, setFriends] = useState<AthleteProfileProps[]>([]);

    useEffect(() => {
        const { athlete, friends: friendsParams }: { athlete: AthleteProfileProps, friends: FriendProps[] } = route.params;
        if (athletes.length < 1) return;

        const frnds = athletes.filter(p => {
            if (p.uid === athlete.uid || p.uid === user.uid) return false;
            return friendsParams.find(f => {
                if (f.users.find(u => u === p.uid)) {
                    if (f.status === FriendStatus.accepted) return true;
                }
                return false
            })
        })

        setFriends(frnds)
    }, [athletes])

    const onNavigateToProfile = (athlete: AthleteProfileProps) => {
        dispatch({ type: SET_CURRENT_ATHLETE, payload: athlete })
        navigation.push(NetworkStackScreens.AthleteDashboard, { athlete })
    }

    const renderItem = useCallback(({ item }: { item: AthleteProfileProps }) => {
        return (
            <AthleteListPreview athlete={item} onNavigateToProfile={onNavigateToProfile} />
        )
    }, [route,])

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
            <FlatList
                initialNumToRender={20}
                data={friends}
                keyExtractor={(item, index) => item._id ? item._id : index}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleContainer: {
        paddingTop: StyleConstants.smallMargin,
        paddingBottom: StyleConstants.smallMargin,
        paddingLeft: StyleConstants.baseMargin,
        borderBottomWidth: .2,
        borderBottomColor: BaseColors.lightGrey
    },
    title: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.secondary
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    athletes: state.athletes.profiles,
    athlete: state.athletes.curAthlete,
    user: state.user
})

const mapDispatchToProps = (dispatch: any) => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AthleteFriends);
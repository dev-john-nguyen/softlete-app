import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';
import {ReducerProps} from '../../services';
import {
  FriendProps,
  UserProps,
  FriendStatus,
  UserActionProps,
} from '../../services/user/types';
import SecondaryText from '../../components/elements/SecondaryText';
import {connect} from 'react-redux';
import {AppDispatch} from '../../../App';
import {
  AthleteProfileProps,
  AthleteActionProps,
} from '../../services/athletes/types';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import {sendFriendRequest} from '../../services/athletes/actions';
import {NetworkStackScreens} from './types';
import {SET_CURRENT_ATHLETE} from '../../services/athletes/actionTypes';
import {
  NotificationActionProps,
  NotificationProps,
} from '../../services/notifications/types';
import NotificationItem from '../../components/notifications/NotificationItem';
import FriendItem from '../../components/notifications/FriendItem';
import {fetchNotifications} from '../../services/notifications/actions';
import {getFriends} from '../../services/user/actions';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

interface Props {
  navigation: any;
  route: any;
  user: UserProps;
  dispatch: AppDispatch;
  athletes: AthleteProfileProps[];
  sendFriendRequest: AthleteActionProps['sendFriendRequest'];
  notifications: NotificationProps[];
  fetchNotifications: NotificationActionProps['fetchNotifications'];
  getFriends: UserActionProps['getFriends'];
}

const Notifications = ({
  navigation,
  user,
  dispatch,
  athletes,
  sendFriendRequest,
  notifications,
  fetchNotifications,
  getFriends,
}: Props) => {
  const [data, setData] = useState<{title: string; data: any[]}[]>([]);
  const [fetching, setFetching] = useState(false);
  const mount = useRef(false);
  const fetchCount = useRef(0);

  useEffect(() => {
    mount.current = true;
    const friends = filterFriends();
    setData([
      {
        title: 'Requests',
        data: friends,
      },
      {
        title: 'Notifications',
        data: notifications,
      },
    ]);
    return () => {
      mount.current = false;
    };
  }, [user, athletes, notifications]);

  const filterFriends = () => {
    return user.friends.filter(f => {
      if (f.status === FriendStatus.pending && f.lastModUid !== user.uid)
        return true;
      return false;
    });
  };

  const onFriendRequestResponse = (userUid: string, accept: boolean) => {
    sendFriendRequest(
      userUid,
      accept ? FriendStatus.accepted : FriendStatus.denied,
    ).catch(err => {
      console.log(err);
    });
  };

  const onNavToAthlete = (athlete?: AthleteProfileProps | string) => {
    if (!athlete) return;
    let athObj = athlete;

    if (typeof athObj === 'string') {
      athObj = JSON.parse(athlete as string);
    }

    dispatch({type: SET_CURRENT_ATHLETE, payload: athObj});
    navigation.navigate(NetworkStackScreens.AthleteDashboard, {
      athlete: athObj,
    });
  };

  const renderFriendsItem = useCallback(
    (item: FriendProps, index: number) => {
      return (
        <FriendItem
          friend={item}
          onNavToAthlete={onNavToAthlete}
          onFriendRequestResponse={onFriendRequestResponse}
          athletes={athletes}
          key={item._id ? item._id : index}
        />
      );
    },
    [user, athletes],
  );

  const renderNotificationItem = useCallback(
    ({item, index}: {item: NotificationProps; index: number}) => {
      return (
        <NotificationItem
          notification={item}
          key={item._id ? item._id : index}
          onPress={() =>
            item.data &&
            item.data.senderProps &&
            onNavToAthlete(item.data.senderProps)
          }
        />
      );
    },
    [notifications],
  );

  const renderItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: any;
      index: number;
      section: {title: string; data: any[]};
    }) => {
      if (section.title === 'Notifications') {
        return renderNotificationItem({item, index});
      } else {
        return renderFriendsItem(item, index);
      }
    },
    [notifications, user, athletes],
  );

  const onRefresh = async () => {
    setFetching(true);

    try {
      if (fetchCount.current % 2) {
        await getFriends();
      } else {
        await fetchNotifications();
      }
    } catch (err) {
      console.log(err);
    }

    fetchCount.current += 1;

    mount.current && setFetching(false);
  };

  return (
    <ScreenTemplate headerPadding>
      <SectionList
        refreshing={fetching}
        onRefresh={onRefresh}
        sections={data}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.titleContainer}>
            <SecondaryText styles={styles.title}>{title}</SecondaryText>
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    paddingTop: StyleConstants.smallMargin,
    paddingBottom: StyleConstants.smallMargin,
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
    borderBottomWidth: 0.2,
    borderBottomColor: BaseColors.lightGrey,
  },
  title: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.secondary,
    textTransform: 'capitalize',
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  user: state.user,
  athletes: state.athletes.profiles,
  notifications: state.notifications.notifications,
});

const mapDispatchToProps = (dispatch: any) => ({
  sendFriendRequest: (userUid: string, status: FriendStatus) =>
    dispatch(sendFriendRequest(userUid, status)),
  fetchNotifications: async () => dispatch(fetchNotifications()),
  getFriends: () => dispatch(getFriends()),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

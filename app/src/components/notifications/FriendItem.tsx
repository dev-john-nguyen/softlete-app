import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AthleteProfileProps } from '../../services/athletes/types';
import { NotificationProps } from '../../services/notifications/types';
import { FriendProps } from '../../services/user/types';
import BaseColors from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import { normalize } from '../../utils/tools';
import PrimaryButton from '../elements/PrimaryButton';
import SecondaryButton from '../elements/SecondaryButton';
import SecondaryText from '../elements/SecondaryText';
import ProfileImage from '../elements/ProfileImage';
import StyleConstants from '../tools/StyleConstants';
import ResponseButton from './ResponseButton';

interface Props {
  friend: FriendProps;
  athletes: AthleteProfileProps[];
  onNavToAthlete: (profile?: AthleteProfileProps) => void;
  onFriendRequestResponse: (uid: string, accept: boolean) => void;
}

const FriendItem = ({
  friend,
  athletes,
  onNavToAthlete,
  onFriendRequestResponse,
}: Props) => {
  const profile = athletes.find(p => friend.users.find(fUid => fUid === p.uid));
  return (
    <View style={[styles.itemContainer]}>
      <Pressable
        style={{ flexDirection: 'row', flex: 1 }}
        onPress={() => onNavToAthlete(profile)}>
        <View style={styles.image}>
          <ProfileImage imageUri={profile ? profile.imageUri : ''} />
        </View>
        <View style={{ flex: 1 }}>
          <SecondaryText styles={styles.itemNameText} bold>
            {profile ? profile.username : 'unknown'}
          </SecondaryText>
          <SecondaryText styles={styles.itemSubText}>
            wants to follow you
          </SecondaryText>
        </View>
      </Pressable>

      <View style={styles.respondContainer}>
        <ResponseButton
          text="Accept"
          onPress={() => profile && onFriendRequestResponse(profile.uid, true)}
          primary
        />
        <ResponseButton
          text="Decline"
          onPress={() => profile && onFriendRequestResponse(profile.uid, false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BaseColors.white,
    padding: 20,
    borderBottomColor: BaseColors.lightGrey,
    borderBottomWidth: 0.2,
  },
  itemNameText: {
    color: BaseColors.black,
    fontSize: StyleConstants.smallerFont,
  },
  itemSubText: {
    color: BaseColors.lightBlack,
    fontSize: StyleConstants.smallerFont,
  },
  respondContainer: {
    flexDirection: 'row',
  },
  image: {
    width: normalize.width(10),
    height: normalize.width(10),
    marginRight: 10,
  },
});
export default FriendItem;

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AthleteProfileProps } from '../../services/athletes/types';
import ProfileImage from '../elements/ProfileImage';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';

interface Props {
  athlete: AthleteProfileProps | undefined;
  onPress: () => void;
}

const MessageProfile = ({ athlete, onPress }: Props) => {
  if (!athlete) return <></>;
  return (
    <View style={styles.container}>
      <Pressable style={{ alignItems: 'center' }} onPress={onPress}>
        <View style={styles.profileImg}>
          <ProfileImage imageUri={athlete.imageUri} />
        </View>
        <PrimaryText styles={styles.username}>{athlete.username}</PrimaryText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: StyleConstants.smallMargin,
    borderBottomColor: BaseColors.lightGrey,
    borderBottomWidth: 0.5,
  },
  profileImg: {
    width: normalize.width(10),
    height: normalize.width(10),
  },
  username: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.black,
    marginTop: 5,
  },
  athlete: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.secondary,
    textTransform: 'capitalize',
  },
});
export default MessageProfile;

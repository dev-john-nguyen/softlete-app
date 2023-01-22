import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import ErrorSvg from '../../assets/ErrorSvg';
import {
  NotificationProps,
  NotificationTypes,
} from '../../services/notifications/types';
import BaseColors from '../../utils/BaseColors';
import { getTimeAgo, normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import ProfileImage from '../elements/ProfileImage';
import StyleConstants from '../tools/StyleConstants';

interface Props {
  notification: NotificationProps;
  onPress: () => void;
}

const NotificationItem = ({ notification, onPress }: Props) => {
  const isError = () =>
    notification.notificationType === NotificationTypes.VIDEO_UPLOAD_ERROR;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.headerContainer}>
        {notification.data?.senderProps && (
          <View style={styles.img}>
            <ProfileImage imageUri={notification.data.senderProps.imageUri} />
          </View>
        )}
        {isError() && (
          <View style={styles.errorSvg}>
            <ErrorSvg fillColor={BaseColors.red} />
          </View>
        )}
        {!!notification.title && (
          <PrimaryText styles={styles.title}>{notification.title}</PrimaryText>
        )}
        <SecondaryText styles={styles.body}>{notification.body}</SecondaryText>
      </View>
      <View style={styles.dateContainer}>
        <SecondaryText styles={styles.date} bold>
          {getTimeAgo(notification.createdAt)}
        </SecondaryText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BaseColors.white,
    padding: StyleConstants.baseMargin,
    flexDirection: 'row',
  },
  img: {
    width: normalize.width(11),
    height: normalize.width(11),
    marginRight: 5,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: StyleConstants.smallerFont,
    textTransform: 'capitalize',
    color: BaseColors.primary,
  },
  body: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.black,
    flex: 1,
  },
  date: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.white,
  },
  dateContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: BaseColors.primary,
    padding: 10,
    marginLeft: 5,
    borderRadius: StyleConstants.borderRadius,
  },
  errorSvg: {
    width: normalize.width(11),
    height: normalize.width(11),
    padding: 5,
    marginRight: 5,
  },
});
export default NotificationItem;

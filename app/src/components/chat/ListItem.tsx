import _ from 'lodash';
import React, { useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import TrashSvg from '../../assets/TrashSvg';
import { AthleteProfileProps } from '../../services/athletes/types';
import { ChatProps } from '../../services/chat/types';
import { UserProps } from '../../services/user/types';
import BaseColors from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import { getTimeAgo, normalize } from '../../utils/tools';
import ProfileImage from '../elements/ProfileImage';
import StyleConstants from '../tools/StyleConstants';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';

interface Props {
  chat: ChatProps;
  user: UserProps;
  onChatPress: (id: string) => void;
  onRemoveChat: (id: string) => void;
}

const ChatListItem = ({ chat, user, onChatPress, onRemoveChat }: Props) => {
  const _left = useSharedValue(0);
  const interval: any = useRef();
  const timer = useRef(0);
  const width = useSharedValue(normalize.width(1));

  const handleRemoveChat = () => onRemoveChat(chat._id);

  const gestureHandler = useAnimatedGestureHandler({
    onStart(event) {},
    onActive(event) {
      if (event.translationX <= 0) {
        _left.value = event.translationX;
      }
    },
    onEnd(event) {
      if (-(width.value / 1.5) > event.translationX) {
        _left.value = withTiming(-width.value);
        runOnJS(handleRemoveChat)();
      } else {
        _left.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: _left.value,
    };
  }, []);

  const userProps: AthleteProfileProps | undefined = chat.usersProps?.find(
    u => u.uid !== user.uid,
  );
  const unread =
    chat.recentUser && chat.recentUser !== user.uid && !chat.read
      ? true
      : false;

  const onPressIn = () => {
    clearInterval(interval.current);
    timer.current = 0;
    interval.current = setInterval(() => {
      timer.current = timer.current + 1;
    }, 100);
  };

  const onPressOut = () => {
    if (_left.value > -10 && timer.current <= 5) return onChatPress(chat._id);
    clearInterval(interval.current);
  };

  const getImageUri = () => {
    if (chat.usersProps) {
      const profile = chat.usersProps.find(u => u.uid !== user.uid);
      return profile?.imageUri;
    }
    return;
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.container}>
      <Animated.View style={animatedStyle}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.content}>
            <View
              style={[
                styles.unread,
                {
                  backgroundColor: unread
                    ? BaseColors.primary
                    : BaseColors.white,
                },
              ]}
            />

            <View style={styles.image}>
              <ProfileImage imageUri={getImageUri()} />
            </View>
            <View style={{ marginLeft: StyleConstants.smallMargin, flex: 1 }}>
              <SecondaryText styles={styles.username} bold>
                {userProps ? userProps.username : 'unknown'}
              </SecondaryText>
              <SecondaryText styles={styles.message} numberOfLines={1}>
                {chat.recentMsg ? chat.recentMsg : ''}
              </SecondaryText>
            </View>
            <View style={styles.timeContainer}>
              <SecondaryText styles={styles.time} bold>
                {getTimeAgo(chat.recentTime)}
              </SecondaryText>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
      <View style={styles.trash}>
        <TrashSvg fillColor={BaseColors.red} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: BaseColors.lightWhite,
  },
  unread: {
    position: 'absolute',
    left: 5,
    borderRadius: 100,
    height: normalize.width(40),
    width: normalize.width(40),
    alignSelf: 'center',
    marginRight: StyleConstants.smallMargin,
  },
  content: {
    flexDirection: 'row',
    padding: StyleConstants.baseMargin,
    backgroundColor: BaseColors.white,
    alignItems: 'center',
  },
  message: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.lightBlack,
  },
  image: {
    height: normalize.width(11),
    width: normalize.width(11),
  },
  username: {
    fontSize: StyleConstants.smallerFont,
    color: BaseColors.black,
  },
  trash: {
    height: normalize.width(20),
    width: normalize.width(20),
    alignSelf: 'center',
    position: 'absolute',
    right: '10%',
    zIndex: -1,
  },
  time: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.white,
  },
  timeContainer: {
    backgroundColor: BaseColors.primary,
    alignSelf: 'center',
    borderRadius: StyleConstants.borderRadius,
    padding: StyleConstants.smallMargin,
    marginLeft: StyleConstants.smallMargin,
  },
});
export default ChatListItem;

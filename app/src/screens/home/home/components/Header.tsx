import React from 'react';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, StyleConstants, rgba, normalize, Constants } from '@app/utils';
import Icon from '@app/icons';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

type HomeNavBarProps = {
  currentIndex: number;
  scrollRef: any;
};

export const HomeNavBar = ({ currentIndex, scrollRef }: HomeNavBarProps) => {
  const onPress = (targetIndex: number) => () =>
    scrollRef.current.scrollTo({ x: normalize.width(1) * targetIndex });

  return (
    <FlexBox
      marginTop={StyleConstants.smallMargin}
      justifyContent="space-around"
      marginRight={20}
      marginLeft={20}
      padding={10}
      backgroundColor={rgba(Colors.whiteRbg, 0.1)}>
      <Icon
        icon="heart"
        size={22}
        containerStyles={{
          borderBottomWidth: currentIndex === 0 ? 1 : 0,
          borderBottomColor: Colors.white,
          padding: 5,
        }}
        onPress={onPress(0)}
        hitSlop={10}
        fillColor={
          currentIndex === 0 ? Colors.white : rgba(Colors.whiteRbg, 0.5)
        }
      />

      <Icon
        icon="notebook"
        size={22}
        containerStyles={{
          borderBottomWidth: currentIndex === 1 ? 1 : 0,
          borderBottomColor: Colors.white,
          padding: 5,
        }}
        onPress={onPress(1)}
        hitSlop={10}
        color={currentIndex === 1 ? Colors.white : rgba(Colors.whiteRbg, 0.5)}
      />

      <Icon
        icon="graph"
        size={22}
        containerStyles={{
          borderBottomWidth: currentIndex === 2 ? 1 : 0,
          borderBottomColor: Colors.white,
          padding: 5,
        }}
        onPress={onPress(2)}
        hitSlop={10}
        color={currentIndex === 2 ? Colors.white : rgba(Colors.whiteRbg, 0.5)}
      />
    </FlexBox>
  );
};

export const HomeHeader = () => {
  const { user } = useSelector((state: ReducerProps) => ({
    user: state.user,
    offline: state.global.offline,
  }));

  const today = new Date();

  const todaysDate = `${
    Constants.months[today.getMonth()]
  } ${today.getDate()}, ${today.getFullYear()}`;

  return (
    <FlexBox paddingLeft={15} paddingRight={15} marginBottom={15}>
      <FlexBox flex={1} column>
        <PrimaryText size="large" fontSize={30}>
          Welcome,
        </PrimaryText>
        <PrimaryText size="large" fontSize={30}>
          {user.username}!
        </PrimaryText>
        <FlexBox alignItems="center" marginTop={10}>
          <Icon icon="calendar" size={20} color={Colors.white} />
          <PrimaryText size="medium" variant="secondary" marginLeft={5}>
            {todaysDate}
          </PrimaryText>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

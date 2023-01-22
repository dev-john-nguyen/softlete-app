import React, { useEffect, useRef, FC } from 'react';
import { Animated, Pressable } from 'react-native';
import { BannerProps, BannerTypes } from '../services/banner/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryText } from '@app/elements';
import { Colors, normalize, rgba } from '@app/utils';
import { FlexBox } from '@app/ui';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { removeBanner } from 'src/services/banner/actions';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BannerItem: FC<{ banner: BannerProps; index: number }> = ({
  banner,
  index,
}) => {
  const dispatch = useDispatch();
  const topAdmin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onShow();
  }, []);

  const onShow = () => {
    Animated.sequence([
      Animated.timing(topAdmin, {
        useNativeDriver: false,
        toValue: 1,
        duration: 1000,
      }),
      Animated.timing(topAdmin, {
        useNativeDriver: false,
        toValue: 0,
        duration: 1000,
        delay: banner.duration || 3000,
      }),
    ]).start(result => {
      if (result.finished) {
        dispatch(removeBanner(banner.id));
      }
    });
  };

  const onClose = () => {
    topAdmin.stopAnimation();
    Animated.timing(topAdmin, {
      useNativeDriver: false,
      toValue: 0,
      duration: 500,
    }).start(() => {
      dispatch(removeBanner(banner.id));
    });
  };

  let leftBorderColor = rgba(Colors.primaryRgb, 0.8);

  switch (banner.type) {
    case BannerTypes.error:
      leftBorderColor = Colors.red;
      break;
    case BannerTypes.warning:
      leftBorderColor = Colors.yellow;
      break;
    case BannerTypes.success:
      leftBorderColor = Colors.green;
      break;
    case BannerTypes.default:
    default:
      leftBorderColor = rgba(Colors.primaryRgb, 0.8);
  }

  return (
    <AnimatedPressable
      style={{
        width: '100%',
        position: 'relative',
        ...Colors.primaryBoxShadow,
        top: topAdmin.interpolate({
          inputRange: [0, 1],
          outputRange: [-normalize.height(5) * (index + 1), 0],
        }),
        marginBottom: 5,
      }}
      onPress={onClose}>
      <FlexBox
        flex={1}
        marginLeft={15}
        marginRight={15}
        backgroundColor={Colors.lightGrey}
        borderRadius={5}
        overflow="hidden">
        <FlexBox
          height="100%"
          position="absolute"
          left={0}
          backgroundColor={leftBorderColor}
          width={6}
        />
        <FlexBox margin={10} marginLeft={15} flex={1}>
          <PrimaryText size="small" color={Colors.primary}>
            {banner.msg}
          </PrimaryText>
        </FlexBox>
      </FlexBox>
    </AnimatedPressable>
  );
};

const Banner = () => {
  const insets = useSafeAreaInsets();
  const { banners } = useSelector((state: ReducerProps) => state.banner);
  return (
    <FlexBox
      overflow="hidden"
      position="absolute"
      width="100%"
      top={banners.length > 0 ? insets.top : -normalize.height(5)}
      column>
      {banners.map((banner, index) => (
        <BannerItem banner={banner} index={index} key={banner.id} />
      ))}
    </FlexBox>
  );
};

export default Banner;

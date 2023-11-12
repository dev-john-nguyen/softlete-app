import { CircleAdd } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React, { FC, useRef, useState } from 'react';
import { View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AddExerciseOption from './AddExerciseOption';
import { DropOptions, DropProps, defaultDrop } from './types';

type Props = {
  onAddExercise: (newGroup?: boolean) => void;
};

const AddExercise: FC<Props> = ({ onAddExercise }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [activeDrop, setActiveDrop] = useState<DropOptions>();
  const [plusPos, setPlusPos] = useState<DropProps>(defaultDrop);
  const [groupValue, setGroupValue] = useState<DropProps>(defaultDrop);
  const [exerciseValue, setExerciseValue] = useState<DropProps>(defaultDrop);
  const plusRef = useRef() as any;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const activateDropHandler = (
    finalPositionX: number,
    finalPositionY: number,
  ) => {
    const compareHandler = (value: DropProps) => {
      return (
        finalPositionX >= value.x &&
        finalPositionX <= value.x + value.width &&
        finalPositionY >= value.y &&
        finalPositionY <= value.y + value.height
      );
    };
    if (compareHandler(exerciseValue)) {
      setActiveDrop(DropOptions.exercise);
    } else if (compareHandler(groupValue)) {
      setActiveDrop(DropOptions.group);
    } else {
      setActiveDrop(undefined);
    }
  };

  const onDragEndHandler = () => {
    if (activeDrop === DropOptions.exercise) {
      onAddExercise();
    } else if (activeDrop === DropOptions.group) {
      onAddExercise(true);
    }
    showOptionsHandler(false);
  };

  const showOptionsHandler = (show: boolean) => {
    setShowOptions(show);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      runOnJS(showOptionsHandler)(true);
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      const finalPositionX = plusPos.x + plusPos.width / 2 + translateX.value;
      const finalPositionY = plusPos.y + plusPos.height / 2 + translateY.value;
      runOnJS(activateDropHandler)(finalPositionX, finalPositionY);
    },
    onEnd: () => {
      runOnJS(onDragEndHandler)();
      translateX.value = 0;
      translateY.value = 0;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      opacity: 0,
      borderRadius: 100,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const dropWrapper = useAnimatedStyle(() => {
    return {
      opacity: showOptions ? withTiming(1) : withTiming(0),
    };
  }, [showOptions]);

  const onLayout = (
    ref: React.MutableRefObject<View>,
    dropOption: DropOptions,
  ) => {
    ref.current.measure((fx, fy, width, height, px, py) => {
      const measurements = {
        x: px,
        y: py,
        width,
        height,
      };
      if (dropOption === DropOptions.plus) {
        setPlusPos(measurements);
      } else if (dropOption === DropOptions.exercise) {
        setExerciseValue(measurements);
      } else {
        setGroupValue(measurements);
      }
    });
  };

  return (
    <FlexBox
      column
      backgroundColor
      position="absolute"
      bottom="0%"
      alignItems="center">
      <FlexBox column alignItems="center" justifyContent="center">
        <Animated.View style={dropWrapper}>
          {showOptions && (
            <FlexBox bottom={5}>
              <AddExerciseOption
                onLayout={onLayout}
                isActive={activeDrop === DropOptions.exercise}
                dropOption={DropOptions.exercise}
              />
              <FlexBox height="100%" width={1} backgroundColor={Colors.white} />
              <AddExerciseOption
                onLayout={onLayout}
                isActive={activeDrop === DropOptions.group}
                dropOption={DropOptions.group}
              />
            </FlexBox>
          )}
        </Animated.View>
      </FlexBox>
      <CircleAdd style={{ position: 'relative', bottom: 0 }} />
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          onTouchStart={() => setShowOptions(true)}
          onTouchEnd={() => setShowOptions(false)}
          ref={plusRef}
          style={animatedStyle}
          onLayout={() => onLayout(plusRef, DropOptions.plus)}>
          <CircleAdd style={{ position: 'relative' }} />
        </Animated.View>
      </PanGestureHandler>
    </FlexBox>
  );
};

export default AddExercise;

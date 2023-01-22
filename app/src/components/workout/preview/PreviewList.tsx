import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable } from 'react-native';
import { Colors } from '@app/utils';
import {
  WorkoutExerciseProps,
  WorkoutProps,
  WorkoutStatus,
  WorkoutTypes,
} from '../../../services/workout/types';
import CircleAdd from '../../elements/CircleAdd';
import { FlatList } from 'react-native-gesture-handler';
import { normalize } from '../../../utils/tools';
import { FlexBox } from '@app/ui';
import { PrimaryText } from '@app/elements';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import PreviewAerobic from './PreviewAerobic';
import Icon from '@app/icons';

interface WorkoutPreviewItemProps {
  workout: Omit<WorkoutProps, 'date'>;
  onPress: (workoutUid: string) => void;
  onLongPress?: (workoutUid: string) => void;
  athlete?: boolean;
}

const WorkoutPreviewItem = ({
  workout,
  onPress,
  onLongPress,
  athlete,
}: WorkoutPreviewItemProps) => {
  const [copied, setCopied] = useState(false);
  const mount = useRef(false);

  useLayoutEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const renderColor = (s: WorkoutStatus) => {
    if (!s) return Colors.primary;
    switch (s) {
      case WorkoutStatus.completed:
        return Colors.green;
      case WorkoutStatus.inProgress:
        return Colors.primary;
      case WorkoutStatus.pending:
        return Colors.secondary;
      default:
        return Colors.primary;
    }
  };

  const onItemLongPress = (workoutUid: string) => {
    if (athlete) return;

    if (onLongPress) {
      setCopied(true);
      onLongPress(workoutUid);
      setTimeout(() => {
        mount.current && setCopied(false);
      }, 1000);
    }
  };

  const copiedAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: copied ? withTiming(1) : withTiming(0),
      position: 'absolute',
      alignSelf: 'center',
      top: copied ? withTiming('30%') : withTiming('0%'),
      zIndex: 100,
      padding: 5,
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,.8)',
    };
  }, [copied]);

  const renderExercises = useCallback(
    (e: WorkoutExerciseProps, i: number) => {
      const { exercise, data } = e;
      const sets = data.length;
      return (
        <FlexBox
          key={e._id ? e._id : i}
          marginBottom={5}
          justifyContent="space-between"
          alignItems="center">
          <PrimaryText numberOfLines={1} textTransform="capitalize">
            {exercise ? exercise.name : 'exercise'}
          </PrimaryText>
          <PrimaryText>{sets} set(s)</PrimaryText>
        </FlexBox>
      );
    },
    [workout],
  );

  const ItemRender = useMemo(() => {
    if (workout.type === WorkoutTypes.TraditionalStrengthTraining) {
      return (
        <>
          {workout.exercises &&
            workout.exercises.filter((e, i) => i < 4).map(renderExercises)}
          {workout.exercises && workout.exercises.length > 4 && (
            <Icon
              icon="ellipsis"
              color={Colors.white}
              size={15}
              opacity={0.6}
            />
          )}
        </>
      );
    }

    return (
      <PreviewAerobic
        data={workout.healthData}
        color={renderColor(workout.status)}
      />
    );
  }, [workout]);

  return (
    <Pressable
      onPress={() => onPress(workout._id)}
      onLongPress={() => onItemLongPress(workout._id)}
      style={{
        backgroundColor: Colors.lightPrimary,
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
      }}>
      <Animated.View style={copiedAnimatedStyles}>
        <PrimaryText
          variant="secondary"
          size="small"
          color={Colors.primary}
          fontSize={12}>
          Copied!
        </PrimaryText>
      </Animated.View>
      <FlexBox marginBottom={5}>
        <PrimaryText
          size="medium"
          numberOfLines={1}
          textTransform="capitalize"
          marginRight={5}
          variant="secondary">
          {workout.name}
        </PrimaryText>
        {workout.status === WorkoutStatus.completed && (
          <Icon icon="checked" size={20} color={Colors.green} />
        )}
      </FlexBox>
      {ItemRender}
    </Pressable>
  );
};

interface Props {
  workouts: Omit<WorkoutProps, 'date'>[];
  onPress: (workoutUid: string) => void;
  onLongPress?: (workoutUid: string) => void;
  onAddWorkout?: () => void;
  athlete?: boolean;
}

const WorkoutPreviewList = ({
  workouts,
  onPress,
  onLongPress,
  onAddWorkout,
  athlete,
}: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: Omit<WorkoutProps, 'date'> }) => (
      <WorkoutPreviewItem
        onPress={onPress}
        onLongPress={onLongPress}
        workout={item}
        athlete={athlete}
      />
    ),
    [workouts, athlete],
  );

  return (
    <FlexBox flex={1} justifyContent="center">
      <FlatList
        data={workouts}
        contentContainerStyle={{ paddingBottom: normalize.height(20) }}
        keyExtractor={(item, index) => (item._id ? item._id : index)}
        renderItem={renderItem}
      />
      {!athlete && onAddWorkout && <CircleAdd onPress={onAddWorkout} />}
    </FlexBox>
  );
};

export default WorkoutPreviewList;

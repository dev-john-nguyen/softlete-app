import { Input, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, rgba, StyleConstants } from '@app/utils';
import React, { Fragment } from 'react';
import { useMemo } from 'react';
import {
  StyleSheet,
  Pressable,
  PressableStateCallbackType,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  WorkoutExerciseDataProps,
  WorkoutStatus,
} from '../../../../services/workout/types';
import { DataKeys } from './types';
import WarmUp from './WarmUp';

type CompletedProps = {
  onPress?: () => void;
  checked?: boolean;
};

const Completed = ({ onPress, checked }: CompletedProps) => {
  return (
    <Pressable
      style={({ pressed }) => ({
        borderColor: pressed
          ? rgba(Colors.greenRbg, 0.5)
          : checked
          ? Colors.green
          : Colors.white,
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      })}
      onPress={onPress}
      hitSlop={5}>
      {({ pressed }) => (
        <Icon
          icon="checked"
          color={
            pressed
              ? rgba(Colors.greenRbg, 0.5)
              : checked
              ? Colors.green
              : rgba(Colors.whiteRbg, 0.1)
          }
          size={30}
        />
      )}
    </Pressable>
  );
};

interface Props {
  showWarmUp: boolean;
  editable: boolean;
  onRemoveSet: (index: number) => void;
  onWarmUpPress: (index: number) => void;
  index: number;
  item: WorkoutExerciseDataProps;
  onChangeText: (
    item: WorkoutExerciseDataProps,
    index: number,
    key: DataKeys,
    val: string,
  ) => void;
  onChangePText: (
    item: WorkoutExerciseDataProps,
    index: number,
    key: DataKeys,
    val: string,
  ) => void;
  placeholder: string;
  value: string;
  athlete?: boolean;
  onCircleCheckPress: (item: WorkoutExerciseDataProps, index: number) => void;
  status: WorkoutStatus;
  dataKey: DataKeys;
}

export const SetContainer = ({
  showWarmUp,
  editable,
  onWarmUpPress,
  onRemoveSet,
  index,
  item,
  onChangeText,
  onChangePText,
  placeholder,
  value,
  athlete,
  onCircleCheckPress,
  status,
  dataKey,
}: Props) => {
  const numberPressableStyle = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => {
    return {
      backgroundColor: pressed
        ? rgba(Colors.lightWhiteRgb, 0.2)
        : 'transparent',
      justifyContent: 'center',
      padding: 10,
      flex: 1,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: rgba(Colors.whiteRbg, 0.8),
    };
  };

  const inputStyles = useMemo(() => {
    return {
      style: {
        width: '100%',
        color: athlete ? Colors.black : Colors.lightWhite,
      },
      containerStyles: {
        width: '100%',
      },
    };
  }, []);

  return (
    <Fragment>
      {showWarmUp && <WarmUp />}
      <FlexBox width="100%" marginBottom={10}>
        <FlexBox flex={0.6} marginRight={10}>
          <Pressable
            style={numberPressableStyle}
            onLongPress={() => editable && onRemoveSet(index)}
            onPress={() => editable && onWarmUpPress(index)}>
            <PrimaryText size="large" variant="secondary">
              {(index + 1).toString()}
            </PrimaryText>
          </Pressable>
        </FlexBox>
        <FlexBox flex={0.8} marginRight={10}>
          <Input
            value={item.reps.toString()}
            onChangeText={val => onChangeText(item, index, DataKeys.reps, val)}
            numbers={true}
            keyboardType="numeric"
            editable={editable && !athlete}
            {...inputStyles}
          />
        </FlexBox>
        <FlexBox flex={1} marginRight={10}>
          <Input
            value={value}
            onChangeText={val => onChangePText(item, index, dataKey, val)}
            numbers={true}
            placeholder={placeholder}
            keyboardType="numeric"
            editable={editable && !athlete}
            {...inputStyles}
          />
        </FlexBox>
        <FlexBox flex={0.8}>
          {!athlete && status === WorkoutStatus.inProgress ? (
            <Completed
              onPress={() => onCircleCheckPress(item, index)}
              checked={item.completed}
            />
          ) : (
            <>
              <Input
                value={item.pct ? item.pct.toString() : '0'}
                onChangeText={val =>
                  onChangeText(item, index, DataKeys.pct, val)
                }
                numbers={true}
                keyboardType="numeric"
                editable={editable && !athlete}
                {...inputStyles}
              />
              <PrimaryText styles={styles.percent}>%</PrimaryText>
            </>
          )}
        </FlexBox>
      </FlexBox>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  percent: {
    position: 'absolute',
    right: '0%',
    top: '0%',
    zIndex: 100000,
    color: Colors.lightWhite,
    fontSize: StyleConstants.smallMediumFont,
    opacity: 0.3,
  },
});

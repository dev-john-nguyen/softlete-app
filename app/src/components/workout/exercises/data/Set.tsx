import { CircleCheck, Input, PrimaryButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, normalize, rgba, StyleConstants } from '@app/utils';
import React, { Fragment } from 'react';
import { useMemo } from 'react';
import {
  View,
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
  status: string;
  dataKey: DataKeys;
  onAddSetPress: () => void;
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
  onAddSetPress,
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
      <FlexBox width="100%" marginBottom={5}>
        {showWarmUp && (
          <FlexBox
            width="100%"
            marginBottom={15}
            alignItems="center"
            justifyContent="space-between"
            opacity={0.5}>
            <FlexBox
              height={1}
              width="30%"
              borderRadius={100}
              backgroundColor={Colors.lightGrey}
            />
            <PrimaryText color={Colors.lightWhite} size="small">
              End Warm Up
            </PrimaryText>
            <FlexBox
              height={1}
              width="30%"
              borderRadius={100}
              backgroundColor={Colors.lightGrey}
            />
          </FlexBox>
        )}
        <FlexBox flex={0.5} marginRight={5}>
          <Pressable
            style={numberPressableStyle}
            onLongPress={() => editable && onRemoveSet(index)}
            onPress={() => editable && onWarmUpPress(index)}>
            <PrimaryText size="large" variant="secondary">
              {(index + 1).toString()}
            </PrimaryText>
          </Pressable>
        </FlexBox>
        <FlexBox flex={1} marginRight={5}>
          <Input
            value={item.reps.toString()}
            onChangeText={val => onChangeText(item, index, DataKeys.reps, val)}
            numbers={true}
            keyboardType="numeric"
            editable={editable && !athlete}
            {...inputStyles}
          />
        </FlexBox>
        <FlexBox flex={1} marginRight={5}>
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
        <FlexBox flex={1}>
          {!athlete && status === WorkoutStatus.inProgress ? (
            <View style={styles.circleCheck}>
              <CircleCheck
                onPress={() => onCircleCheckPress(item, index)}
                checked={item.completed}
              />
            </View>
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
      {!athlete && editable && (
        <PrimaryButton
          onPress={onAddSetPress}
          marginTop={10}
          width="100%"
          borderRadius={5}
          fontSize="small"
          fontVariant="secondary">
          Add Set
        </PrimaryButton>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  circleCheck: {
    width: normalize.width(10),
    height: normalize.width(10),
  },
  percent: {
    position: 'absolute',
    right: '0%',
    top: '0%',
    zIndex: 100000,
    color: Colors.lightWhite,
    fontSize: StyleConstants.smallMediumFont,
    opacity: 0.3,
  },
  setsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: rgba(Colors.lightWhiteRgb, 0.2),
    marginRight: 5,
    width: '100%',
    padding: 10,
    marginTop: StyleConstants.baseMargin,
  },
});

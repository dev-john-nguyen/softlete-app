import { Input, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, StyleConstants, rgba } from '@app/utils';
import React, { Fragment } from 'react';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  WorkoutExerciseDataProps,
  WorkoutStatus,
} from '../../../../services/workout/types';
import { DataKeys } from './types';
import WarmUp from './WarmUp';
import Checkmark from './Checkmark';
import { SET_COLUMN_WIDTHS } from './constants';

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
      <FlexBox width="100%" marginBottom={10}>
        <FlexBox
          flex={SET_COLUMN_WIDTHS.one}
          marginRight={10}
          alignItems="center">
          <Checkmark
            editable={editable}
            onPress={() =>
              !athlete && editable && onCircleCheckPress(item, index)
            }
            checked={item.completed}
            status={status}
          />
        </FlexBox>
        <FlexBox flex={SET_COLUMN_WIDTHS.two} marginRight={10}>
          <Input
            value={item.reps.toString()}
            onChangeText={val => onChangeText(item, index, DataKeys.reps, val)}
            numbers={true}
            keyboardType="numeric"
            editable={editable && !athlete}
            {...inputStyles}
          />
        </FlexBox>
        <FlexBox flex={SET_COLUMN_WIDTHS.three} marginRight={10}>
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
        <FlexBox flex={SET_COLUMN_WIDTHS.four} marginRight={10}>
          <Input
            value={item.pct ? item.pct.toString() : '0'}
            onChangeText={val => onChangeText(item, index, DataKeys.pct, val)}
            numbers={true}
            keyboardType="numeric"
            editable={editable && !athlete}
            {...inputStyles}
          />
          <PrimaryText styles={styles.percent}>%</PrimaryText>
        </FlexBox>
        <FlexBox flex={SET_COLUMN_WIDTHS.five} alignItems="center">
          <Icon
            icon="thermometer"
            size={25}
            color={
              item.warmup
                ? status === WorkoutStatus.completed
                  ? rgba(Colors.whiteRbg, 0.5)
                  : Colors.white
                : rgba(Colors.whiteRbg, 0.2)
            }
            onPress={() => editable && onWarmUpPress(index)}
            containerStyles={{ marginRight: 10 }}
          />
          <Icon
            icon="trash_bin"
            size={23}
            color={editable ? Colors.white : rgba(Colors.whiteRbg, 0.2)}
            onPress={() => editable && onRemoveSet(index)}
          />
        </FlexBox>
      </FlexBox>
      {showWarmUp && <WarmUp />}
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

import Icon from '@app/icons';
import { Colors, normalize, rgba } from '@app/utils';
import React, { FC, useCallback } from 'react';
import { Pressable } from 'react-native';
import { WorkoutStatus } from 'src/services/workout/types';

type Props = {
  onPress?: () => void;
  checked?: boolean;
  editable?: boolean;
  status: WorkoutStatus;
};

const Checkmark: FC<Props> = ({ checked, onPress, editable, status }) => {
  const colorHandler = useCallback(
    (pressed: boolean) => {
      if (pressed && editable) {
        return rgba(Colors.greenRbg, 0.5);
      }
      if (checked) return Colors.green;
      if (status === WorkoutStatus.completed) return rgba(Colors.whiteRbg, 0.2);
      return rgba(Colors.whiteRbg, 0.5);
    },
    [checked, editable, status],
  );

  return (
    <Pressable
      style={({ pressed }) => ({
        borderColor: colorHandler(pressed),
        borderWidth: 1,
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize.width(10),
        width: normalize.width(10),
      })}
      onPress={onPress}
      hitSlop={5}>
      {({ pressed }) => (
        <Icon icon="checked" color={colorHandler(pressed)} size={12} />
      )}
    </Pressable>
  );
};

export default Checkmark;

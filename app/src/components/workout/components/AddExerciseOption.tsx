import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { DropOptions } from './types';
import { Colors } from '@app/utils';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';

type Props = {
  onLayout: (
    ref: React.MutableRefObject<View>,
    dropOption: DropOptions,
  ) => void;
  isActive: boolean;
  dropOption: DropOptions;
};

const AddExerciseOption: React.FC<Props> = ({
  onLayout,
  isActive,
  dropOption,
}) => {
  const ref = useRef() as React.MutableRefObject<View>;
  const isExDrop = dropOption === DropOptions.exercise;
  const kettleColor = isActive ? Colors.primary : Colors.white;
  const killFillColor = isActive ? Colors.white : Colors.primary;
  return (
    <View
      ref={ref}
      style={[
        styles.dropContainer,
        Colors.primaryBoxShadow,
        {
          backgroundColor: isActive ? Colors.white : Colors.primary,
          borderTopLeftRadius: isExDrop ? 100 : undefined,
          borderBottomLeftRadius: isExDrop ? 100 : undefined,
          borderTopRightRadius: isExDrop ? undefined : 100,
          borderBottomRightRadius: isExDrop ? undefined : 100,
          borderLeftWidth: isExDrop ? 1 : undefined,
          borderRightWidth: isExDrop ? undefined : 1,
        },
      ]}
      onLayout={() => onLayout(ref, dropOption)}>
      {isExDrop ? (
        <Icon icon="kettlebell" size={20} color={kettleColor} />
      ) : (
        <FlexBox alignItems="center">
          <Icon
            icon="kettlebell"
            size={20}
            color={kettleColor}
            fillColor={killFillColor}
            containerStyles={{ position: 'absolute', left: 12, zIndex: -1 }}
          />
          <Icon
            icon="kettlebell"
            size={20}
            fillColor={killFillColor}
            color={kettleColor}
          />
          <Icon
            icon="kettlebell"
            size={20}
            color={kettleColor}
            fillColor={killFillColor}
            containerStyles={{ position: 'absolute', right: 12, zIndex: -1 }}
          />
        </FlexBox>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropContainer: {
    padding: 12,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    flexDirection: 'row',
  },
});

export default AddExerciseOption;

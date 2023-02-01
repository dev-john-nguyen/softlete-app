import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Input from '../../../elements/Input';
import { FlexBox } from '@app/ui';
import { PrimaryText, ToolTip } from '@app/elements';
import { Colors, rgba, strToFloat, StyleConstants } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  calcRef: number | undefined;
  onCalcRefUpdate: (calc: string | number) => void;
}

const CalcRef = ({ onCalcRefUpdate, calcRef }: Props) => {
  const [info, setInfo] = useState(false);

  const onCalcRefInputChange = (calcStr: string) => {
    const calc = strToFloat(calcStr);
    onCalcRefUpdate(calc);
  };

  return (
    <FlexBox flex={1} alignItems="center">
      <ToolTip
        message="This number multiply by col 4 populates col 3."
        position="absolute"
        top="-10%"
        right="-3%"
        zIndex={100}
      />

      <Icon
        icon="calculator"
        color={rgba(Colors.lightWhiteRgb, 0.5)}
        onPress={() => setInfo(i => (i ? false : true))}
        size={25}
      />

      <Input
        value={calcRef ? calcRef.toString() : '0'}
        onChangeText={onCalcRefInputChange}
        placeholder="0"
        numbers={true}
        keyboardType="numeric"
        containerStyles={{ flex: 1 }}
      />
    </FlexBox>
  );
};

export default CalcRef;

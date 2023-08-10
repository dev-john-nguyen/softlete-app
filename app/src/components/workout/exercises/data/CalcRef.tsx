import React from 'react';
import Input from '../../../elements/Input';
import { FlexBox } from '@app/ui';
import { ToolTip } from '@app/elements';
import { strToFloat } from '@app/utils';

interface Props {
  calcRef: number | undefined;
  onCalcRefUpdate: (calc: string | number) => void;
}

const CalcRef = ({ onCalcRefUpdate, calcRef }: Props) => {
  const onCalcRefInputChange = (calcStr: string) => {
    const calc = strToFloat(calcStr);
    onCalcRefUpdate(calc);
  };

  return (
    <FlexBox flex={1} alignItems="center">
      <ToolTip
        message="The percentage will use this value to calculate the value of the set."
        zIndex={100}
        duration={5}
        marginRight={5}
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

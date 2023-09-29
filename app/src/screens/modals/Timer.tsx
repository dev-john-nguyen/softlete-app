import { PrimaryButton, PrimaryText, CustomPicker } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import React, { Fragment, useMemo, useState } from 'react';
import UnderLay from './Underlay';
import { PickerOptionProp } from 'src/components/elements/Picker';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps, ThunkAppDispatch } from 'src/services';
import { clearTime, setTime, startTimerHandler } from '@app/services';

enum PickerTimers {
  hrs = 'hrs',
  mins = 'mins',
  secs = 'secs',
}

const hrsArr: PickerOptionProp[] = new Array(24).fill({}).map((_, index) => ({
  value: index,
  label: String(index),
}));

const minsnsecsArr: PickerOptionProp[] = new Array(60)
  .fill({})
  .map((_, index) => ({
    value: index,
    label: String(index),
  }));

const Timer = () => {
  const dispatch = useDispatch<ThunkAppDispatch>();
  const { isRunning, time } = useSelector((state: ReducerProps) => state.timer);
  const [isPickerOpen, setIsPickerOpen] = useState<PickerTimers>();

  const onPickerChangeValue = (value: string) => {
    if (!isPickerOpen) return;
    dispatch(
      setTime({
        ...time,
        [isPickerOpen]: parseInt(value) || 0,
      }),
    );
  };

  const pickerOptions: PickerOptionProp[] = useMemo(() => {
    switch (isPickerOpen) {
      case PickerTimers.hrs:
        return hrsArr;
      case PickerTimers.mins:
      case PickerTimers.secs:
        return minsnsecsArr;
      default:
        return [];
    }
  }, [isPickerOpen]);

  const startTimer = () => dispatch(startTimerHandler());

  const cancelTimer = () => dispatch(clearTime());

  return (
    <Fragment>
      <CustomPicker
        open={Boolean(isPickerOpen)}
        setOpen={() => setIsPickerOpen(undefined)}
        value=""
        pickerOptions={pickerOptions}
        setValue={onPickerChangeValue}
      />
      <FlexBox
        column
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor={rgba(Colors.primaryRgb, 0.5)}>
        <UnderLay />
        <FlexBox
          column
          alignItems="center"
          justifyContent="center"
          backgroundColor={Colors.blendWhite}
          borderRadius={5}
          padding={20}>
          <FlexBox marginBottom={10}>
            <PrimaryText variant="primary" size="large">
              Stopwatch
            </PrimaryText>
          </FlexBox>
          <FlexBox>
            <FlexBox
              borderRadius={5}
              padding={10}
              borderWidth={1}
              borderColor={Colors.white}
              backgroundColor={
                !isRunning ? rgba(Colors.whiteRbg, 0.1) : 'transparent'
              }
              onPress={() => !isRunning && setIsPickerOpen(PickerTimers.hrs)}>
              <PrimaryText variant="primary" fontSize={30}>
                {time.hrs < 10 ? `0${time.hrs}` : time.hrs}
              </PrimaryText>
            </FlexBox>
            <FlexBox
              alignItems="center"
              justifyContent="center"
              marginRight={5}
              marginLeft={5}>
              <PrimaryText variant="primary" bold>
                :
              </PrimaryText>
            </FlexBox>
            <FlexBox
              borderRadius={5}
              borderWidth={1}
              borderColor={Colors.white}
              padding={10}
              backgroundColor={
                !isRunning ? rgba(Colors.whiteRbg, 0.1) : 'transparent'
              }
              onPress={() => !isRunning && setIsPickerOpen(PickerTimers.mins)}>
              <PrimaryText variant="primary" fontSize={30}>
                {time.mins < 10 ? `0${time.mins}` : time.mins}
              </PrimaryText>
            </FlexBox>
            <FlexBox
              bold
              alignItems="center"
              justifyContent="center"
              marginRight={5}
              marginLeft={5}>
              <PrimaryText variant="primary" bold>
                :
              </PrimaryText>
            </FlexBox>
            <FlexBox
              borderRadius={5}
              borderWidth={1}
              borderColor={Colors.white}
              padding={10}
              backgroundColor={
                !isRunning ? rgba(Colors.whiteRbg, 0.1) : 'transparent'
              }
              onPress={() => !isRunning && setIsPickerOpen(PickerTimers.secs)}>
              <PrimaryText variant="primary" fontSize={30}>
                {time.secs < 10 ? `0${time.secs}` : time.secs}
              </PrimaryText>
            </FlexBox>
          </FlexBox>
          <FlexBox
            marginTop={15}
            alignSelf="stretch"
            justifyContent="space-between">
            <PrimaryButton onPress={cancelTimer}>Cancel</PrimaryButton>
            <PrimaryButton variant="secondary" onPress={startTimer}>
              {isRunning ? 'Pause' : 'Start'}
            </PrimaryButton>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Fragment>
  );
};

export default Timer;

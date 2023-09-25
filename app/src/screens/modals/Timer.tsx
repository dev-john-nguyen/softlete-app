import { PrimaryButton, PrimaryText, CustomPicker } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import UnderLay from './Underlay';
import { PickerOptionProp } from 'src/components/elements/Picker';
import useBanner from 'src/hooks/utils/useBanner';

function secondsToTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) {
    // Handle invalid input
    return {
      hrs: 0,
      mins: 0,
      secs: 0,
    };
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hrs: hours,
    mins: minutes,
    secs: remainingSeconds,
  };
}

enum PickerTimers {
  hrs = 'hrs',
  mins = 'mins',
  secs = 'secs',
}

const hrsArr: PickerOptionProp[] = new Array(24).fill({}).map((_, index) => ({
  value: index + 1,
  label: String(index + 1),
}));

const minsnsecsArr: PickerOptionProp[] = new Array(60)
  .fill({})
  .map((_, index) => ({
    value: index + 1,
    label: String(index + 1),
  }));

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<NodeJS.Timer>();
  const [time, setTime] = useState({
    hrs: 0,
    mins: 0,
    secs: 0,
  });
  const [isPickerOpen, setIsPickerOpen] = useState<PickerTimers>();
  const setBanner = useBanner();

  const onPickerChangeValue = (value: string) => {
    setTime(prevTime => {
      if (!isPickerOpen) return prevTime;
      return {
        ...prevTime,
        [isPickerOpen]: parseInt(value) || 0,
      };
    });
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
    return [];
  }, [isPickerOpen]);

  useEffect(() => {
    return () => timerId.current && clearInterval(timerId.current);
  }, []);

  const startTimer = () => {
    if (!isRunning) {
      // convert time to seconds
      const hrSecs = time.hrs * 60 * 60;
      const minSecs = time.mins * 60;
      const userInput = hrSecs + minSecs + time.secs;
      if (userInput < 1) {
        return setBanner('Please add time to the timer to start the timer');
      }
      setIsRunning(true);
      timerId.current = setInterval(() => {
        setTime(prevTime => {
          const hrSecs = prevTime.hrs * 60 * 60;
          const minSecs = prevTime.mins * 60;
          let prevTimeInSecs = hrSecs + minSecs + prevTime.secs;
          if (prevTimeInSecs <= 0) {
            timerId.current && clearInterval(timerId.current);
            setIsRunning(false);
            return {
              hrs: 0,
              mins: 0,
              secs: 0,
            };
          }
          prevTimeInSecs--;
          return secondsToTime(prevTimeInSecs);
        });
      }, 1000); // Timer interval in milliseconds (1 second)
    } else {
      timerId.current && clearInterval(timerId.current);
      setIsRunning(false);
    }
  };

  const cancelTimer = () => {
    timerId.current && clearInterval(timerId.current);
    setIsRunning(false);
    setTime({
      hrs: 0,
      mins: 0,
      secs: 0,
    });
  };

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
              Timer
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

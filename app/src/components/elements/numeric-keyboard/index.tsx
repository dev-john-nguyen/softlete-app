import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';
import { FC, useEffect, useMemo, useState } from 'react';
import PrimaryText from '../PrimaryText';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const containerBgColor = rgba(Colors.primaryRgb, 0.5);

type NumberButton = {
  value: string;
  onPress: (value: string) => void;
};

const NumericButton: FC<NumberButton> = ({ onPress, value }) => {
  return (
    <FlexBox
      flex={1}
      padding={20}
      borderRadius={20}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderColor={Colors.white}
      onPress={() => onPress(value)}>
      <PrimaryText size="large">{value}</PrimaryText>
    </FlexBox>
  );
};

type NumericKeyboard = {
  onNumberKeypadSubmit?: (value: number) => void;
  isNumericKeypadOpen?: boolean;
  defaultNumericValue?: number;
};

const NumericKeyboard: FC<NumericKeyboard> = ({
  onNumberKeypadSubmit,
  isNumericKeypadOpen,
  defaultNumericValue,
}) => {
  const [value, setValue] = useState('0');

  const isInvalid = useMemo(() => {
    return isNaN(parseFloat(value)) || value.split('.').length - 1 > 1;
  }, [value]);

  useEffect(() => {
    setValue((defaultNumericValue ?? 0).toString());
  }, [defaultNumericValue]);

  const onButtonPress = (v: string) => {
    if (value.length > 10) return;
    setValue(val => (val === '0' ? v : val + v));
  };

  const onSubmit = () => {
    if (isInvalid) return;
    onNumberKeypadSubmit?.(parseFloat(value));
    setValue('0');
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: '100%',
      position: 'absolute',
      bottom: isNumericKeypadOpen ? withTiming('0%') : withTiming('-100%'),
      padding: 20,
      backgroundColor: containerBgColor,
      opacity: isNumericKeypadOpen ? withTiming(1) : withTiming(0),
    };
  }, [isNumericKeypadOpen]);

  return (
    <Animated.View style={containerAnimatedStyle}>
      <FlexBox column flex={1} gap={10} onPress={onSubmit}>
        <FlexBox flex={1} />
        <FlexBox
          borderWidth={1}
          borderColor={isInvalid ? Colors.red : 'transparent'}
          padding={20}
          borderRadius={10}
          backgroundColor="#2C1A1A"
          width="100%"
          alignItems="center">
          <FlexBox gap={10} width="100%" alignItems="center">
            <PrimaryText variant="primary" fontSize={30} flex={1}>
              {value}
            </PrimaryText>
            <FontAwesome6Icon
              name="arrow-rotate-right"
              color={Colors.white}
              size={30}
              onPress={() => setValue((defaultNumericValue ?? 0).toString())}
            />
          </FlexBox>
        </FlexBox>
        <FlexBox
          column
          flex={1}
          backgroundColor="#2C1A1A"
          padding={20}
          gap={10}
          borderRadius={10}>
          <FlexBox gap={20}>
            <NumericButton value={'1'} onPress={onButtonPress} />
            <NumericButton value={'2'} onPress={onButtonPress} />
            <NumericButton value={'3'} onPress={onButtonPress} />
          </FlexBox>
          <FlexBox gap={20}>
            <NumericButton value={'4'} onPress={onButtonPress} />
            <NumericButton value={'5'} onPress={onButtonPress} />
            <NumericButton value={'6'} onPress={onButtonPress} />
          </FlexBox>
          <FlexBox gap={20}>
            <NumericButton value={'7'} onPress={onButtonPress} />
            <NumericButton value={'8'} onPress={onButtonPress} />
            <NumericButton value={'9'} onPress={onButtonPress} />
          </FlexBox>
          <FlexBox gap={20}>
            <NumericButton value={'.'} onPress={onButtonPress} />
            <NumericButton value={'0'} onPress={onButtonPress} />
            <FlexBox
              flex={1}
              padding={20}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor={Colors.white}
              onPress={() => {
                setValue(value.slice(0, -1) || '0');
              }}>
              <FontAwesome6Icon
                name="delete-left"
                color={Colors.white}
                size={20}
              />
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Animated.View>
  );
};
export default NumericKeyboard;

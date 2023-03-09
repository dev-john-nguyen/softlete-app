import { Picker } from '@react-native-picker/picker';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SearchBar } from '@app/elements';
import BaseColors, { rgba } from '../../utils/BaseColors';
import Fonts from '../../utils/Fonts';
import { normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';
import capitalize from 'lodash/capitalize';
import useKeyboard from 'src/hooks/utils/useKeyboard';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';

export type PickerOptionProp = {
  value: string | number;
  label: string;
  color?: string;
};

interface Props {
  setValue: (val: string) => void;
  setOpen: (active: boolean) => void;
  value: string;
  open: boolean;
  pickerOptions: PickerOptionProp[];
}

const AnimatedPicker = Animated.createAnimatedComponent(Picker);

const CustomPicker = ({
  value,
  setOpen,
  setValue,
  open,
  pickerOptions: pickerOptionProp,
}: Props) => {
  const fullHeight = useSharedValue(normalize.height(1));
  const [pickerValue, setPickerValue] = useState('');
  const [pickerOptions, setPickerOptions] = useState<PickerOptionProp[]>([]);
  const keyboardHeight = useKeyboard();
  const pickerRef = useRef<any>();

  useLayoutEffect(() => {
    setPickerValue(value);
    setPickerOptions(pickerOptionProp);
  }, [open, value, pickerOptionProp]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: open
        ? withTiming(1, { duration: 100 })
        : withTiming(0, { duration: 100 }),
      position: 'absolute',
      zIndex: open ? 100 : withTiming(-100),
      bottom: withTiming(keyboardHeight),
      height: fullHeight.value,
      justifyContent: 'flex-end',
      width: '100%',
      borderRadius: 5,
      padding: 15,
      backgroundColor: `rgba(0,0,0,.05)`,
    };
  }, [open, keyboardHeight]);

  const animatedPickerStyles = useAnimatedStyle(() => {
    return {
      bottom: open ? withTiming(0) : withTiming(-100),
    };
  }, [open]);

  const filteredOptionItems = useMemo(() => {
    return pickerOptions.map(o => (
      <Picker.Item
        label={capitalize(o.label)}
        value={o.value}
        key={o.value}
        color={o.color}
      />
    ));
  }, [pickerOptions]);

  const onSearch = async (value: string) => {
    const newOptions = pickerOptions.filter(
      a => a.label.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setPickerOptions(newOptions);
    if (newOptions.length > 0) setPickerValue(newOptions[0].value as string);
  };

  return (
    <Animated.View style={animatedStyles}>
      <FlexBox
        onPress={() => {
          setValue(pickerValue);
          setOpen(false);
        }}
        flex={1}
        column
      />
      <FlexBox
        overflow="hidden"
        backgroundColor={rgba(Colors.lightWhiteRgb, 0.98)}
        borderRadius={5}
        column>
        {open && (
          <SearchBar
            iconColor={BaseColors.primary}
            color={BaseColors.lightBlack}
            containerStyles={styles.search}
            onChange={onSearch}
            onSearch={onSearch}
          />
        )}
        <AnimatedPicker
          ref={pickerRef}
          selectedValue={pickerValue}
          itemStyle={styles.itemStyle}
          style={[styles.pickerContainer, animatedPickerStyles]}
          enabled={false}
          onValueChange={(itemValue: any) => {
            setPickerValue(itemValue);
          }}>
          {filteredOptionItems}
        </AnimatedPicker>
      </FlexBox>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
  },
  itemStyle: {
    fontSize: StyleConstants.smallMediumFont,
    fontFamily: Fonts.secondary,
    color: BaseColors.black,
    textTransform: 'capitalize',
  },
  search: {
    flex: 0,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 0,
    justifyContent: 'center',
  },
});
export default CustomPicker;

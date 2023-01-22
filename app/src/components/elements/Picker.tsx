import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

interface Props {
  setValue: (val: string) => void;
  setOpen: (active: boolean) => void;
  pickerItems?: React.ReactElement[];
  value: string;
  open: boolean;
  hidebgColor?: boolean;
  options?: string[];
}

const AnimatedPicker = Animated.createAnimatedComponent(Picker);

const CustomPicker = ({
  pickerItems,
  value,
  setOpen,
  setValue,
  open,
  hidebgColor,
  options,
}: Props) => {
  const fullWidth = useSharedValue(normalize.width(1));
  const fullHeight = useSharedValue(normalize.height(1));
  const [pickerValue, setPickerValue] = useState('');
  const [pickerOptions, setPickerOptions] = useState<string[] | undefined>([]);
  const keyboardHeight = useKeyboard();
  const pickerRef = useRef<any>();

  useEffect(() => {
    setPickerValue(value);
    setPickerOptions(options);
  }, [value, options]);

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

  const optionItems = useMemo(() => {
    return pickerOptions?.map(o => (
      <Picker.Item label={capitalize(o)} value={o} key={o} />
    ));
  }, [pickerOptions]);

  const getFilteredOptions = (value: string) =>
    options?.filter(s => s.toLowerCase().includes(value.toLowerCase())) || [];

  const onChange = async (searchValue: string) => {
    setPickerOptions(getFilteredOptions(searchValue));
  };

  const onSearch = async (searchValue: string) => {
    const filtered = getFilteredOptions(searchValue);
    if (filtered.length > 0) setPickerValue(filtered[0]);
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
            onChange={onChange}
            onSearch={onSearch}
          />
        )}
        <AnimatedPicker
          ref={pickerRef}
          selectedValue={pickerValue}
          itemStyle={styles.itemStyle}
          style={[styles.pickerContainer, animatedPickerStyles]}
          enabled={false}
          onValueChange={(itemValue: any) => setPickerValue(itemValue)}>
          {pickerItems || optionItems}
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

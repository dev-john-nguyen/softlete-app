import React, { useEffect } from 'react';
import { ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { FlexBox } from '@app/ui';
import { useNavigation } from '@react-navigation/native';
import BackButton from './BackButton';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CustomPicker from './Picker';
import DatePicker from 'react-native-date-picker';
import { Colors, moderateScale } from '@app/utils';
import useKeyboard from 'src/hooks/utils/useKeyboard';
import PrimaryText from './PrimaryText';

interface Props {
  children: JSX.Element | JSX.Element[];
  headerPadding?: boolean;
  applyContentPadding?: boolean;
  isBackVisible?: boolean;
  leftContent?: JSX.Element;
  middleContent?: JSX.Element;
  rightContent?: JSX.Element;
  onGoBack?: () => void;
  isPickerOpen?: boolean;
  onPickerClose?: () => void;
  pickerValue?: string;
  pickerItems?: React.ReactElement[];
  onPickerChangeValue?: (value: string) => void;
  isDatePickerOpen?: boolean;
  datePickerValue?: Date;
  onDatePickerClose?: () => void;
  onDatePickerChange?: (date: Date) => void;
  rotateBack?: string;
  enableScrollWrapper?: boolean;
  isLoading?: boolean;
  applyKeyboardDismiss?: boolean;
}

const ScreenTemplate = ({
  children,
  headerPadding,
  isBackVisible,
  leftContent,
  rightContent,
  middleContent,
  applyContentPadding,
  onGoBack,
  isPickerOpen = false,
  onPickerClose,
  pickerValue = '',
  pickerItems = [],
  onPickerChangeValue,
  isDatePickerOpen = false,
  datePickerValue,
  onDatePickerClose,
  onDatePickerChange,
  rotateBack,
  enableScrollWrapper,
  isLoading,
  applyKeyboardDismiss,
}: Props) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigate = useNavigation();
  const keyboardHeight = useKeyboard();

  useEffect(() => {
    if (isPickerOpen || isDatePickerOpen) {
      Keyboard.dismiss();
    }
  }, [isPickerOpen, isDatePickerOpen]);

  const goBackHandler = () => {
    Keyboard.dismiss();
    onGoBack ? onGoBack() : navigate.canGoBack() ? navigate.goBack() : null;
  };

  const hasHeaderContent =
    isBackVisible || leftContent || middleContent || rightContent;

  return (
    <>
      <LinearGradient
        colors={['#250000', '#170001', '#250000']}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'top']}>
          <FlexBox
            marginTop={headerPadding ? headerHeight - insets.top : 0}
            justifyContent="space-between"
            alignItems="stretch"
            paddingBottom={hasHeaderContent ? 5 : 0}
            paddingLeft={15}
            paddingRight={15}
            zIndex={100}>
            <FlexBox flex={0.3}>
              {isBackVisible && (
                <BackButton
                  onPress={goBackHandler}
                  rotateBack={rotateBack || '0'}
                />
              )}
              {leftContent}
            </FlexBox>
            <FlexBox flex={1} alignItems="center" justifyContent="center">
              {middleContent}
            </FlexBox>
            <FlexBox flex={0.3}>{rightContent}</FlexBox>
          </FlexBox>
          {enableScrollWrapper ? (
            <>
              <ScrollView
                contentContainerStyle={{}}
                style={{
                  padding: applyContentPadding ? moderateScale(15) : 0,
                  paddingBottom: 0,
                  paddingTop: applyContentPadding ? moderateScale(5) : 0,
                }}>
                {children}
              </ScrollView>
              <FlexBox height={keyboardHeight} />
            </>
          ) : (
            <FlexBox
              flexDirection="column"
              padding={applyContentPadding ? 15 : 0}
              paddingBottom={0}
              paddingTop={applyContentPadding ? 5 : 0}
              flex={1}
              position="relative"
              onPress={
                applyKeyboardDismiss ? () => Keyboard.dismiss() : undefined
              }>
              {isLoading ? (
                <FlexBox alignItems="center" justifyContent="center">
                  <PrimaryText marginRight={10} size="large">
                    Loading
                  </PrimaryText>
                  <ActivityIndicator size="small" color={Colors.white} />
                </FlexBox>
              ) : (
                children
              )}
            </FlexBox>
          )}
        </SafeAreaView>
      </LinearGradient>
      <CustomPicker
        open={isPickerOpen}
        setOpen={() => onPickerClose && onPickerClose()}
        value={pickerValue}
        pickerItems={pickerItems}
        setValue={value => onPickerChangeValue && onPickerChangeValue(value)}
      />
      <DatePicker
        modal
        mode="date"
        open={isDatePickerOpen}
        date={datePickerValue || new Date()}
        onConfirm={date => {
          onDatePickerClose && onDatePickerClose();
          onDatePickerChange && onDatePickerChange(date);
        }}
        onCancel={onDatePickerClose}
      />
    </>
  );
};

export default ScreenTemplate;

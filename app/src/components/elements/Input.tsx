import React from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { StyleProp, StyleSheet } from 'react-native';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PrimaryText from './PrimaryText';
import Icon, { IconOptions } from '@app/icons';
import { Colors } from '@app/utils';

interface Props {
  placeholder?: string;
  onChangeText: (txt: string) => void;
  value?: string;
  keyboardType?: 'numeric';
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  secureTextEntry?: boolean;
  multiline?: boolean;
  onSubmitEditing?: () => void;
  numbers?: boolean;
  onBlur?: () => void;
  editable?: boolean;
  onFocus?: () => void;
  styles?: StyleProp<ViewStyle>;
  containerStyles?: StyleProp<ViewStyle>;
  autoCorrect?: TextInputProps['autoCorrect'];
  blurOnSubmit?: boolean;
  inputRef?: any;
  maxHeight?: number;
  variant?: 'textarea' | 'input';
  label?: string;
  ml?: number;
  mr?: number;
  mb?: number;
  mt?: number;
  m?: number;
  defaultValue?: string;
  icon?: IconOptions;
}

const Input = ({
  placeholder,
  onChangeText,
  value,
  keyboardType,
  maxLength,
  autoCapitalize,
  textContentType,
  secureTextEntry,
  multiline,
  onSubmitEditing,
  numbers,
  onBlur,
  editable = true,
  onFocus,
  styles,
  autoCorrect,
  blurOnSubmit,
  inputRef,
  maxHeight,
  variant = 'input',
  label,
  defaultValue,
  icon,
  containerStyles,
  ...props
}: Props) => {
  const renderStyles = () => {
    const borderStyles: ViewStyle = {
      borderBottomWidth: 1,
      borderBottomColor: BaseColors.lightGrey,
    };

    if (variant === 'textarea') {
      borderStyles.borderWidth = 1;
      borderStyles.borderColor = Colors.white;
    }

    return {
      fontSize: numbers ? moderateScale(20) : StyleConstants.smallFont,
      paddingTop: multiline ? 10 : undefined,
      borderBottomColor: BaseColors.white,
      color: BaseColors.white,
      maxHeight: maxHeight,
      ...borderStyles,
    };
  };

  return (
    <View
      style={[
        {
          marginRight: props.mr,
          marginLeft: props.ml,
          marginTop: props.mt,
          marginBottom: props.mb,
          margin: props.m,
          opacity: editable ? 1 : 0.5,
        },
        containerStyles,
      ]}>
      {label && (
        <PrimaryText size="small" marginBottom={5} opacity={0.8}>
          {label}
        </PrimaryText>
      )}
      <View>
        {icon && (
          <View style={baseStyles.svg}>
            <Icon icon={icon} size={20} color={Colors.white} />
          </View>
        )}
        <TextInput
          style={[
            baseStyles.input,
            { paddingLeft: icon ? moderateScale(40) : undefined },
            renderStyles(),
            styles,
          ]}
          placeholder={placeholder}
          placeholderTextColor={rgba(BaseColors.whiteRbg, 0.2)}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType ? textContentType : 'none'}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          onSubmitEditing={onSubmitEditing}
          onBlur={onBlur}
          editable={editable || editable == null ? true : false}
          onFocus={onFocus}
          autoCorrect={autoCorrect}
          blurOnSubmit={blurOnSubmit}
          ref={inputRef}
          defaultValue={defaultValue}
        />
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  input: {
    padding: 10,
    fontFamily: 'Lato-Regular',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: BaseColors.lightGrey,
    backgroundColor: rgba(BaseColors.whiteRbg, 0.05),
  },
  label: {
    fontSize: StyleConstants.extraSmallFont,
    color: BaseColors.lightWhite,
    marginBottom: 5,
  },
  svg: {
    position: 'absolute',
    left: '3%',
    zIndex: 100,
    top: '20%',
  },
});

export default Input;

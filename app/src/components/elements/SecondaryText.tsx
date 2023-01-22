import React from 'react';
import { Text } from 'react-native';
import { StyleProp, StyleSheet } from 'react-native';
import BaseColors from '../../utils/BaseColors';

interface Props {
  styles?: StyleProp<any>;
  placeholder?: string;
  children: any;
  bold?: boolean;
  numberOfLines?: number;
}

export default ({ styles, children, bold, numberOfLines }: Props) => (
  <Text
    style={[
      styles,
      {
        fontFamily: bold ? 'Lato-Bold' : 'Lato-Regular',
        letterSpacing: styles?.letterSpacing ? styles.letterSpacing : 0.2,
        color: styles?.color || BaseColors.lightWhite,
      },
    ]}
    numberOfLines={numberOfLines}
    adjustsFontSizeToFit>
    {children}
  </Text>
);

const baseStyles = StyleSheet.create({});

import {
  Colors,
  moderateScale,
  useResizeStyles,
  StyleConstants,
} from '@app/utils';
import React, { FC } from 'react';
import { Text } from 'react-native';
import { StyleProp } from 'react-native';
import { Fonts } from '@app/utils';

interface Props {
  styles?: StyleProp<any>;
  children: JSX.Element | JSX.Element[];
  numberOfLines?: number;
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'medium' | 'small';
  bold?: boolean;
}

const PrimaryText: FC<Props & StyleProp<any>> = ({
  styles,
  children,
  numberOfLines,
  variant = 'primary',
  bold,
  size = 'small',
  ...styleProps
}) => {
  const addStyles = useResizeStyles(styleProps);

  const { fontSize, textTransform, fontFamily, letterSpacing } = (() => {
    // eventually only use size to define font size
    // should only have a limit of 3 font sizes in the app
    // not urgent
    let letterSpacing = styleProps.letterSpacing || 0.5;
    let fontSize = StyleConstants.fontSize[size];
    let textTransform = styleProps.textTransform;
    let fontFamily = Fonts.primary;
    if (styleProps.fontSize) {
      fontSize = moderateScale(styleProps.fontSize);
    } else if (size === 'large') {
      // set default large to uppercase font
      textTransform = styleProps.textTransform;
      letterSpacing = 1;
    }

    if (variant === 'secondary' || size === 'small' || size === 'medium') {
      fontFamily = bold ? Fonts.secondaryBold : Fonts.secondary;
    }

    return { fontSize, textTransform, fontFamily, letterSpacing };
  })();

  return (
    <Text
      style={[
        styles,
        addStyles,
        {
          letterSpacing: letterSpacing,
          color: styles?.color || styleProps?.color || Colors.lightWhite,
          fontSize: fontSize,
          fontFamily,
          textTransform,
        },
      ]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit>
      {children}
    </Text>
  );
};

export default PrimaryText;

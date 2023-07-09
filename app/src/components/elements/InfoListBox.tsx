import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { Colors, Constants, normalize } from '@app/utils';
import PrimaryText from './PrimaryText';
import Icon, { IconOptions } from '@app/icons';

type Props = {
  color?: string;
  letter?: number;
  icon?: IconOptions;
  desc?: string;
  onPress?: () => void;
  secondary?: boolean;
  label?: string;
  screenWidthPct?: number;
  marginBottom?: number;
  marginTop?: number;
  flex?: number;
  marginRight?: number;
  opacity?: number;
  textTransform?: 'capitalize';
  disablePressIcon?: boolean;
  hasBorder?: boolean;
};

const InfoListBox: FC<Props> = ({
  color = Colors.white,
  letter,
  icon,
  desc,
  onPress,
  secondary,
  label,
  screenWidthPct,
  marginBottom,
  marginTop,
  flex,
  marginRight,
  opacity = 1,
  textTransform,
  disablePressIcon,
  hasBorder,
}) => {
  if (secondary) {
    return (
      <FlexBox
        opacity={opacity}
        flex={flex}
        borderRadius={5}
        marginRight={marginRight ?? 10}
        padding={15}
        maxWidth={normalize.width(1.6)}
        backgroundColor={Colors.lightPrimary}
        onPress={onPress}
        screenWidthPct={screenWidthPct}
        marginBottom={marginBottom}
        marginTop={marginTop}
        borderColor={hasBorder ? Colors.white : undefined}
        borderWidth={hasBorder ? 1 : undefined}
        column>
        {icon && (
          <Icon
            icon={icon || 'checked'}
            size={20}
            color={color}
            containerStyles={{ marginBottom: 10 }}
          />
        )}
        <FlexBox column>
          <PrimaryText opacity={0.6} marginBottom={2}>
            {label}
          </PrimaryText>
          <PrimaryText size="medium" textTransform={textTransform}>
            {desc}
          </PrimaryText>
        </FlexBox>
        {!disablePressIcon && onPress && (
          <FlexBox
            position="absolute"
            right={5}
            top={5}
            borderColor={color}
            borderWidth={1}
            padding={5}
            borderRadius={100}>
            <Icon icon="chevron" direction="right" color={color} size={5} />
          </FlexBox>
        )}
      </FlexBox>
    );
  }
  return (
    <FlexBox
      opacity={opacity}
      flex={flex}
      borderRadius={5}
      marginRight={marginRight || 5}
      alignItems="center"
      padding={15}
      maxWidth={normalize.width(1.6)}
      borderColor={hasBorder ? Colors.white : undefined}
      borderWidth={hasBorder ? 1 : undefined}
      backgroundColor={Colors.lightPrimary}
      onPress={onPress}
      column>
      {letter != null ? (
        <FlexBox
          marginBottom={5}
          borderRadius={100}
          borderWidth={1}
          width={25}
          height={25}
          justifyContent="center"
          alignItems="center"
          borderColor={color}
          column>
          <PrimaryText
            variant="secondary"
            size="small"
            numberOfLines={1}
            textTransform="capitalize">
            {Constants.abc[letter]}
          </PrimaryText>
        </FlexBox>
      ) : (
        <Icon icon={icon || 'checked'} size={20} color={color} />
      )}
      <PrimaryText
        color={color}
        size="small"
        variant="secondary"
        marginTop={5}
        textTransform={textTransform}>
        {desc}
      </PrimaryText>
      {!disablePressIcon && onPress && (
        <FlexBox
          position="absolute"
          right={5}
          top={5}
          borderColor={color}
          borderWidth={1}
          padding={5}
          borderRadius={100}>
          <Icon icon="chevron" direction="right" color={color} size={5} />
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default InfoListBox;

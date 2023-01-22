import React, { FC } from 'react';
import { FlexBox } from '@app/ui';
import { Colors, Constants, normalize } from '@app/utils';
import PrimaryText from './PrimaryText';
import Icon, { IconOptions } from '@app/icons';

type Props = {
  color?: string;
  letter?: number;
  icon?: IconOptions;
  desc: string;
  onPress?: () => void;
  secondary?: boolean;
  label?: string;
  screenWidthPct?: number;
  marginBottom?: number;
  marginTop?: number;
};

const InfoListBox: FC<Props> = ({
  color = Colors.primary,
  letter,
  icon,
  desc,
  onPress,
  secondary,
  label,
  screenWidthPct,
  marginBottom,
  marginTop,
}) => {
  if (secondary) {
    return (
      <FlexBox
        borderRadius={5}
        marginRight={10}
        padding={15}
        maxWidth={normalize.width(1.6)}
        backgroundColor={Colors.lightPrimary}
        onPress={onPress}
        screenWidthPct={screenWidthPct}
        marginBottom={marginBottom}
        marginTop={marginTop}
        column>
        <Icon icon={icon || 'checked'} size={20} color={color} />
        <FlexBox column marginTop={10}>
          <PrimaryText opacity={0.6}>{label}</PrimaryText>
          <PrimaryText size="medium">{desc}</PrimaryText>
        </FlexBox>
      </FlexBox>
    );
  }
  return (
    <FlexBox
      borderRadius={5}
      marginRight={5}
      alignItems="center"
      padding={15}
      maxWidth={normalize.width(1.6)}
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
      <PrimaryText color={color} size="small" variant="secondary" marginTop={5}>
        {desc}
      </PrimaryText>
    </FlexBox>
  );
};

export default InfoListBox;

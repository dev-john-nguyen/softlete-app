import Icon, { IconOptions } from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { StyleProp } from 'react-native';
import BaseColors, { rgba } from '../../utils/BaseColors';
import PrimaryText from './PrimaryText';

type Props = {
  disabled?: boolean;
  onPress?: () => void;
  children: any;
  label?: string;
  borderRadius?: number;
  containerStyles?: StyleProp<any>;
  arrow?: boolean;
  arrowDirection?: 'down' | 'right' | 'left' | 'up';
  borderBottom?: boolean;
  marginBottom?: number;
  isActive?: boolean;
  textTransform?: 'capitalize';
  icon?: IconOptions;
  valueOpacity?: number;
  padding?: number;
};

const PickerButton: React.FC<Props> = props => {
  return (
    <FlexBox
      {...props.containerStyles}
      column
      opacity={props.disabled ? 0.5 : 1}>
      {!!props.label && (
        <PrimaryText
          variant="secondary"
          size="small"
          marginBottom={5}
          opacity={0.8}>
          {props.label}
        </PrimaryText>
      )}
      <FlexBox
        padding={props.padding ?? 15}
        marginBottom={props.marginBottom ?? 15}
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={rgba(Colors.whiteRbg, props.isActive ? 0.2 : 0.05)}
        borderRadius={props.borderRadius || 5}
        borderBottomWidth={props.borderBottom ? 1 : 0}
        borderBottomColor={BaseColors.lightGrey}
        onPress={props.disabled ? undefined : props.onPress}>
        <PrimaryText
          opacity={props.valueOpacity ?? 1}
          variant="secondary"
          size="small"
          textTransform={props.textTransform}>
          {props.children}
        </PrimaryText>
        {props.arrow && (
          <Icon
            icon="chevron"
            size={17}
            color={BaseColors.lightWhite}
            direction={props.arrowDirection || 'right'}
            containerStyles={{ opacity: props.valueOpacity ?? 1 }}
          />
        )}
        {props.icon && (
          <Icon
            icon={props.icon}
            size={17}
            color={BaseColors.lightWhite}
            direction={props.arrowDirection || 'right'}
          />
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default PickerButton;

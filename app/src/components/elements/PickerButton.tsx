import Icon from '@app/icons';
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
};

const PickerButton: React.FC<Props> = props => {
  return (
    <FlexBox {...props.containerStyles} column>
      {!!props.label && (
        <PrimaryText variant="secondary" size="small" marginBottom={5}>
          {props.label}
        </PrimaryText>
      )}
      <FlexBox
        padding={10}
        paddingLeft={15}
        paddingRight={15}
        marginBottom={props.marginBottom || 15}
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={rgba(Colors.whiteRbg, 0.05)}
        opacity={props.disabled ? 0.5 : 1}
        borderRadius={props.borderRadius || 5}
        borderBottomWidth={props.borderBottom ? 1 : 0}
        borderBottomColor={BaseColors.lightGrey}
        onPress={props.disabled ? undefined : props.onPress}>
        <PrimaryText variant="secondary" size="small">
          {props.children}
        </PrimaryText>
        {props.arrow && (
          <Icon
            icon="chevron"
            size={12}
            color={BaseColors.lightWhite}
            direction={props.arrowDirection || 'right'}
          />
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default PickerButton;

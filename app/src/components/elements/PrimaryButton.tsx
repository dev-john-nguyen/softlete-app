import { Colors, rgba } from '@app/utils';
import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { StyleProp } from 'react-native';
import PrimaryText from './PrimaryText';

interface Props {
  styles?: StyleProp<any>;
  children: any;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const PrimaryButton = ({
  styles,
  children,
  onPress,
  loading,
  variant = 'primary',
  ...stylesProps
}: Props & StyleProp<any>) => {
  return (
    <Pressable
      style={({ pressed }) => {
        const renderCustomStyles = () => {
          if (variant === 'secondary') {
            return {
              backgroundColor: pressed ? Colors.darkGrey : Colors.lightGrey,
              borderWidth: 1,
              borderColor: Colors.white,
            };
          }
          return {
            borderColor: pressed
              ? rgba(Colors.whiteRbg, 0.5)
              : rgba(Colors.whiteRbg, 1),
            borderWidth: 1,
          };
        };

        return [
          {
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          },
          {
            ...renderCustomStyles(),
          },
          styles,
          stylesProps,
        ];
      }}
      onPress={onPress}>
      <PrimaryText
        color={variant === 'secondary' ? Colors.primary : Colors.white}>
        {children}
      </PrimaryText>
      {loading && (
        <ActivityIndicator
          size="small"
          color={Colors.white}
          style={{ marginLeft: 5 }}
        />
      )}
    </Pressable>
  );
};

export default PrimaryButton;

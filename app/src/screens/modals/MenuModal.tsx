import { PickerButton, PrimaryText } from '@app/elements';
import { IconOptions } from '@app/icons';
import { FlexBox } from '@app/ui';
import React, { FC } from 'react';
import { Colors, rgba } from '@app/utils';
import UnderLay from './Underlay';

export type MenuItemProps = {
  onPress: () => void;
  icon: IconOptions;
  text: string;
};

type MenuModalProps = {
  menuItems: MenuItemProps[];
  title: string;
};

const MenuModal: FC<MenuModalProps> = ({ menuItems, title }) => {
  return (
    <FlexBox
      column
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={rgba(`0,0,0`, 0.5)}>
      <UnderLay />
      <FlexBox
        column
        flex={1}
        width="70%"
        justifyContent="center"
        alignItems="stretch">
        <UnderLay />
        <FlexBox
          column
          backgroundColor={Colors.primary}
          applyBoxShadow
          padding={10}
          paddingTop={20}
          borderRadius={5}>
          <FlexBox column alignItems="center">
            <PrimaryText size="medium" variant="primary" bold>
              {title}
            </PrimaryText>
          </FlexBox>
          <FlexBox column padding={15}>
            {menuItems.map((props, index) => (
              <PickerButton
                key={index}
                icon={props.icon}
                onPress={props.onPress}>
                {props.text}
              </PickerButton>
            ))}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default MenuModal;

import React from 'react';
import { Linking } from 'react-native';
import { SERVERURL } from '../../utils/PATHS';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { PickerButton } from '@app/elements';

const Legal = () => {
  const onPP = async () => {
    const url = SERVERURL + 'privacy-policy';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };
  const onTOU = async () => {
    const url = SERVERURL + 'terms';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };

  return (
    <ScreenTemplate
      applyContentPadding
      headerTitleFormatted="Legal"
      isBackVisible>
      <PickerButton arrow onPress={onPP} borderRadius={100}>
        Privacy Policy
      </PickerButton>

      <PickerButton arrow onPress={onTOU} borderRadius={100}>
        Terms Of Use
      </PickerButton>
    </ScreenTemplate>
  );
};

export default Legal;

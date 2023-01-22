import React from 'react';
import { Linking } from 'react-native';
import PrimaryText from '../../components/elements/PrimaryText';
import { SERVERURL } from '../../utils/PATHS';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { PickerButton } from '@app/elements';
import { FlexBox } from '@app/ui';

interface Props {}

const Legal = ({}: Props) => {
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
    <ScreenTemplate headerPadding>
      <FlexBox flexDirection="column" padding={20} paddingTop={5}>
        <PrimaryText fontSize={20}>Legal</PrimaryText>
        <PickerButton
          arrow
          onPress={onPP}
          borderRadius={100}
          containerStyles={{ marginTop: 20 }}>
          Privacy Policy
        </PickerButton>

        <PickerButton
          arrow
          onPress={onTOU}
          borderRadius={100}
          containerStyles={{ marginTop: 10 }}>
          Terms Of Use
        </PickerButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default Legal;

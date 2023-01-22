import { Linking } from 'react-native';
import React from 'react';
import Icon from '@app/icons';
import { PickerButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import { logout } from 'src/services/absolute-exports';
import { SettingsStackScreens } from './types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import { AdminStackList } from 'src/screens/admin/screens/types';
import { IndexStackList } from '../types';

interface Props {
  navigation: any;
}

function SettingsHome({ navigation }: Props) {
  const userState = useSelector((state: ReducerProps) => state.user);
  const dispatch = useDispatch();

  const onNavToEditProfile = () =>
    navigation.navigate(SettingsStackScreens.EditProfile);
  const onNavToEditSubs = () =>
    navigation.navigate(SettingsStackScreens.Subscription);
  const onNavToPassword = () =>
    navigation.navigate(SettingsStackScreens.ResetPassword);
  const onNavToSettings = () => Linking.openURL('x-apple-health://');
  const onRemoveAccount = () =>
    navigation.navigate(SettingsStackScreens.RemoveAccount);
  const onNavToReportBug = () =>
    navigation.navigate(SettingsStackScreens.BugReport);
  const onNavToLegal = () => navigation.navigate(SettingsStackScreens.Legal);

  const onNavToAdmin = () =>
    userState.admin &&
    navigation.navigate(IndexStackList.AdminStack, {
      screen: AdminStackList.AdminHome,
    });

  const onSignout = () => dispatch(logout());

  return (
    <ScreenTemplate>
      <FlexBox flexDirection="column" padding={20} paddingTop={0}>
        <PrimaryText size="large">Settings</PrimaryText>

        <PickerButton
          arrow
          onPress={onNavToEditProfile}
          borderRadius={100}
          containerStyles={{ marginTop: 15 }}>
          Profile
        </PickerButton>

        {userState.admin && (
          <PickerButton
            arrow
            onPress={onNavToAdmin}
            borderRadius={100}
            containerStyles={{ marginTop: 5 }}>
            Admin
          </PickerButton>
        )}

        <PickerButton
          arrow
          onPress={onNavToEditSubs}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Subscription
        </PickerButton>

        <PickerButton
          arrow
          onPress={onNavToPassword}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Reset Password
        </PickerButton>

        <PickerButton
          arrow
          onPress={onNavToSettings}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Apple Health Permissions
        </PickerButton>

        <PickerButton
          arrow
          onPress={onNavToLegal}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Legal
        </PickerButton>

        <PickerButton
          arrow
          onPress={onNavToReportBug}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Issue Report
        </PickerButton>

        <PickerButton
          arrow
          onPress={onRemoveAccount}
          borderRadius={100}
          containerStyles={{ marginTop: 5 }}>
          Remove Account
        </PickerButton>
      </FlexBox>
      <FlexBox paddingLeft={20} paddingRight={20} justifyContent="flex-end">
        <Icon
          icon="signout"
          size={30}
          color={Colors.white}
          onPress={onSignout}
          containerStyles={{
            transform: [{ rotate: '180deg' }],
          }}
        />
      </FlexBox>
    </ScreenTemplate>
  );
}

export default SettingsHome;

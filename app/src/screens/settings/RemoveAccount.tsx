import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { FlexBox } from '@app/ui';
import { PrimaryButton, PrimaryText, ScreenTemplate } from '@app/elements';
import { Alert } from 'react-native';
import request from '../../services/utils/request';
import LocalStoragePaths from '../../utils/LocalStoragePaths';
import PATHS from '../../utils/PATHS';
import auth from '@react-native-firebase/auth';
import { logout } from '../../services/user/actions';
import { setBanner } from 'src/services/banner/actions';
import { BannerTypes } from 'src/services/banner/types';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';

interface Props {
  state: any;
  navigation: any;
}

const RemoveAccount = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const mount = useRef(false);
  const user = useSelector((state: ReducerProps) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    mount.current = true;
    if (user.admin) {
      dispatch(
        setBanner(
          BannerTypes.warning,
          'Please contact us directly to remove your account.',
        ),
      );
      props.navigation.goBack();
    }
    return () => {
      mount.current = false;
    };
  }, [user, dispatch]);

  const onRemoveAccount = async () => {
    if (loading) return;
    setLoading(true);
    const currentUser = auth().currentUser;
    if (!currentUser) return Alert.alert('Please logout and and log back in.');
    const { data } = await request('POST', PATHS.user.remove, dispatch);
    if (data) {
      const allPaths = Object.values(LocalStoragePaths);
      await AsyncStorage.multiRemove(allPaths).catch(err => console.log(err));
      dispatch(logout());
    }
    mount.current && setLoading(false);
  };

  return (
    <ScreenTemplate headerPadding>
      <FlexBox flexDirection="column" padding={20} paddingTop={5}>
        <PrimaryText fontSize={20} marginBottom={5}>
          Remove Account
        </PrimaryText>
        <PrimaryText
          variant="secondary"
          fontSize={14}
          opacity={0.8}
          marginBottom={20}>
          Are you sure you want to remove your account? Once your account has
          been removed all of your data will be lost.
        </PrimaryText>
        <PrimaryButton onPress={onRemoveAccount} loading={loading}>
          Remove My Account
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default RemoveAccount;

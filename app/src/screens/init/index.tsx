import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps } from '../../services';
import { logout } from '../../services/user/actions';
import paths, { SERVERURL } from '../../utils/PATHS';
import { SIGNIN_USER } from '../../services/user/actionTypes';
import axios from 'axios';
import { IndexStackList } from '../types';
import PrimaryButton from '../../components/elements/PrimaryButton';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Input, PrimaryText, ScreenTemplate } from '@app/elements';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';

function validateUsername(val: string) {
  const reg = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  return reg.test(val);
}

const InitUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: ReducerProps) => state.user);
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const setBanner = useBanner();

  useEffect(() => {
    if (user && user.username)
      navigation.navigate(IndexStackList.NewUserAdvise);
  }, [user]);

  const onSave = () => {
    if (loading) return;

    if (!username || username.length < 8 || username.length > 20) {
      return setBanner('Username must be between 8-20 characters.');
    }

    if (!name) return setBanner('Name is required');

    if (!validateUsername(username)) {
      return setBanner('Invalid username. Please try again.');
    }

    setLoading(true);

    let email = '';

    const currentUser = auth().currentUser;

    // get email if available
    if (currentUser?.email) {
      email = currentUser.email;
    }

    axios
      .post(SERVERURL + paths.signin.register, { name, username, email })
      .then(({ data }) => {
        if (data) {
          dispatch({ type: SIGNIN_USER, payload: { ...user, ...data } });
          navigation.navigate(IndexStackList.NewUserAdvise);
        } else {
          setBanner(
            'An unexpected error occurred. Please try restart the app.',
            BannerTypes.error,
          );
        }
      })
      .catch(err => {
        if (err) {
          const { response } = err;
          if (response.data) {
            if (response.data.tokenExpired) {
              setLoading(false);
              dispatch(logout());
              return;
            }
            setLoading(false);
            return setBanner(response.data, BannerTypes.error);
          }
        }
        setBanner(
          'Unexpected error occurred. Please try again.',
          BannerTypes.error,
        );
        setLoading(false);
      });
  };

  return (
    <ScreenTemplate applyContentPadding applyKeyboardDismiss>
      <PrimaryText bold variant="primary" fontSize={30} marginBottom={10}>
        Account Setup
      </PrimaryText>

      <Input
        value={username}
        placeholder="johnny1234"
        onChangeText={txt => setUsername(txt.replace(/\s/g, '').toLowerCase())}
        maxLength={100}
        autoCapitalize="none"
        label="Username"
        mb={20}
      />

      <Input
        value={name}
        placeholder="John Doe"
        onChangeText={txt => setName(txt)}
        maxLength={200}
        autoCapitalize="words"
        label={`Name`}
        mb={20}
      />

      <PrimaryText bold marginBottom={10}>
        Username Criteria
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        {`- Only contains alphanumeric characters, underscore and dot.`}
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        {`- Underscore and dot can't be at the end or start of a username.`}
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        {`- Underscore and dot can't be next to each other.`}
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        {`- Underscore or dot can't be used multiple times in a row.`}
      </PrimaryText>
      <PrimaryText marginBottom={5}>
        - Number of characters must be between 8 to 20.
      </PrimaryText>

      <PrimaryButton onPress={onSave} loading={loading} marginTop={10}>
        Next
      </PrimaryButton>
    </ScreenTemplate>
  );
};

export default InitUser;

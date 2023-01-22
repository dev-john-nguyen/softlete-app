import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { validateEmail } from '../../utils/tools';
import { Input, PrimaryButton, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { BannerTypes } from 'src/services/banner/types';
import useBanner from 'src/hooks/utils/useBanner';

interface Props {
  register: boolean;
  onNavigateToForgot: () => void;
}

type Error = {
  message: string;
  code: string;
};

function errorHandler(error: Error) {
  const { code, message } = error;
  console.log(code, message);
  switch (code) {
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/email-already-in-use':
      return 'Looks like your email is already in use.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long and complex.';
    case 'auth/wrong-password':
    case 'auth/invalid-email':
    case 'auth/user-disabled':
    case 'auth/user-not-found':
      return 'Invalid Credentials. Please try again.';
    default:
      return 'An unexpected error occurred.';
  }
}

const LoginForm = ({ register, onNavigateToForgot }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const attempts = useRef(0);
  const setBanner = useBanner();

  const onSubmit = () => {
    if (loading) return;

    if (!email || !password || !password)
      return setBanner('Email and password are required.', BannerTypes.error);

    if (!validateEmail(email))
      return setBanner(
        'Invalid email address. Please try again.',
        BannerTypes.error,
      );

    if (password.length < 6)
      return setBanner(
        'Password should be at least 6 characters long.',
        BannerTypes.error,
      );

    if (!register) return onLogin();

    if (password !== password2)
      return setBanner('Password do not match.', BannerTypes.error);

    setLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        const errorMsg = errorHandler(error);
        setBanner(errorMsg, BannerTypes.error);
        setLoading(false);
      });
  };

  const onLogin = () => {
    setLoading(true);

    if (attempts.current > 4) {
      setLoading(false);
      setBanner('No more attempts. Please try again later.', BannerTypes.error);
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (attempts.current < 4) {
          const errorMsg = errorHandler(error);
          setBanner(errorMsg, BannerTypes.error);
        } else {
          setBanner(
            'Invalid Credentials. One more attempt.',
            BannerTypes.error,
          );
        }
        attempts.current = attempts.current + 1;
        setLoading(false);
      });
  };

  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={txt => setEmail(txt.trim())}
        textContentType="emailAddress"
        autoCapitalize="none"
        icon="mail"
        mb={20}
      />

      <Input
        placeholder="Password"
        onChangeText={txt => setPassword(txt.trim())}
        textContentType="password"
        secureTextEntry
        autoCapitalize="none"
        icon="lock"
        mb={20}
      />

      {register ? (
        <Input
          placeholder="Confirm Password"
          onChangeText={txt => setPassword2(txt.trim())}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
          icon="lock"
          mb={20}
        />
      ) : (
        <FlexBox
          onPress={onNavigateToForgot}
          marginBottom={10}
          width="100%"
          justifyContent="flex-end">
          <PrimaryText>Recovery Password</PrimaryText>
        </FlexBox>
      )}
      <PrimaryButton onPress={onSubmit} loading={loading}>
        {register ? 'Register' : 'Login'}
      </PrimaryButton>
    </View>
  );
};

export default LoginForm;

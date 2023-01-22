import React, { useState } from 'react';
import { Pressable, Linking, Keyboard } from 'react-native';
import LoginForm from './LoginForm';
import ForgotPassword from './ForgotPassword';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { SERVERURL } from '../../utils/PATHS';
import { PrimaryButton, PrimaryText, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors, moderateScale } from '@app/utils';

const SignIn = () => {
  const [register, setRegister] = useState(false);
  const [forgot, setForgot] = useState(false);

  const onRegStateChange = () => setRegister(r => (r ? false : true));

  const onNavigateToForgot = () => setForgot(f => (f ? false : true));

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

  async function onAppleButtonPress() {
    // performs login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
      }

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (err) {
      console.log(err);
    }
  }

  if (forgot) return <ForgotPassword onGoBack={onNavigateToForgot} />;

  return (
    <ScreenTemplate applyContentPadding applyKeyboardDismiss>
      <FlexBox column marginBottom={10}>
        <Icon icon="logo" size={60} variant="secondary" />
        <PrimaryText bold variant="primary" fontSize={30} marginTop={10}>
          Softlete
        </PrimaryText>
        <PrimaryText marginTop={2} size="medium">
          Plan, Train, Evaluate, Repeat
        </PrimaryText>
      </FlexBox>

      <LoginForm register={register} onNavigateToForgot={onNavigateToForgot} />

      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        marginTop={10}
        marginBottom={10}>
        <FlexBox
          height={1}
          flex={1}
          backgroundColor={Colors.white}
          marginRight={20}
        />
        <PrimaryText textAlign="center">or</PrimaryText>
        <FlexBox
          height={1}
          flex={1}
          backgroundColor={Colors.white}
          marginLeft={20}
        />
      </FlexBox>
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE_OUTLINE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: '100%', // You must specify a width
          height: moderateScale(40), // You must specify a height
        }}
        onPress={() => onAppleButtonPress()}
      />

      <FlexBox
        marginTop={10}
        justifyContent="center"
        alignItems="stretch"
        column>
        {register ? (
          <>
            <PrimaryText textAlign="center" marginBottom={10}>
              Already a member?
            </PrimaryText>
            <PrimaryButton onPress={onRegStateChange}>Login</PrimaryButton>
          </>
        ) : (
          <>
            <PrimaryText textAlign="center" marginBottom={10}>
              Not a member?
            </PrimaryText>
            <PrimaryButton onPress={onRegStateChange}>Register</PrimaryButton>
          </>
        )}
      </FlexBox>

      <FlexBox column alignItems="center" marginTop={10}>
        <PrimaryText marginBottom={5}>
          By using our service, you agree to the following
        </PrimaryText>
        <Pressable onPress={onTOU}>
          <PrimaryText textDecorationLine="underline">Terms of Use</PrimaryText>
        </Pressable>
        <FlexBox height={5} />
        <Pressable onPress={onPP}>
          <PrimaryText textDecorationLine="underline">
            Privacy Policy
          </PrimaryText>
        </Pressable>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default SignIn;

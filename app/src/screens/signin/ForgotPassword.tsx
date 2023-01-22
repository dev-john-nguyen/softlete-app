import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleConstants from '../../components/tools/StyleConstants';
import SecondaryText from '../../components/elements/SecondaryText';
import BaseColors from '../../utils/BaseColors';
import MailSvg from '../../assets/MailSvg';
import Fonts from '../../utils/Fonts';
import { normalize, validateEmail } from '../../utils/tools';
import PrimaryText from '../../components/elements/PrimaryText';
import PrimaryButton from '../../components/elements/PrimaryButton';
import SendMailSvg from '../../assets/SendMailSvg';
import BackButton from '../../components/elements/BackButton';

interface Props {
  onGoBack: () => void;
}

const ForgotPassword = ({ onGoBack }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSendResetPassword = () => {
    if (!email || !validateEmail(email) || loading)
      return Alert.alert('Invalid email. Please try again.');

    setLoading(true);

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setLoading(false);
        setSent(true);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        Alert.alert('Failed to send recovery email. Please try again');
      });
  };

  if (sent)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BaseColors.white }}>
        <View style={styles.container}>
          <BackButton onPress={onGoBack} />
          <View style={{ alignItems: 'center' }}>
            <View style={styles.mail}>
              <SendMailSvg fillColor={BaseColors.primary} />
            </View>
            <PrimaryText styles={styles.title}>Check your mail</PrimaryText>
            <SecondaryText styles={styles.sub}>
              We have sent a password recover instructions to your email.
            </SecondaryText>
          </View>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BaseColors.white }}>
      <View style={styles.container}>
        <BackButton onPress={onGoBack} />
        <PrimaryText styles={styles.title}>Reset Password</PrimaryText>
        <SecondaryText styles={styles.sub}>
          Enter the email associated with your account and we'll send an email
          with instructions to reset your password.
        </SecondaryText>
        <View style={styles.inputContainer}>
          <View style={styles.svg}>
            <MailSvg fillColor={BaseColors.primary} />
          </View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={txt => setEmail(txt.trim())}
            textContentType="emailAddress"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={BaseColors.lightGrey}
          />
        </View>
        <PrimaryButton
          styles={styles.btn}
          onPress={onSendResetPassword}
          loading={loading}>
          Send Instructions
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: StyleConstants.baseMargin,
  },
  mail: {
    width: normalize.width(5),
    height: normalize.width(5),
  },
  btn: {
    fontSize: StyleConstants.smallFont,
    marginTop: StyleConstants.baseMargin * 2,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: StyleConstants.mediumFont,
    color: BaseColors.black,
    marginTop: StyleConstants.baseMargin,
  },
  sub: {
    fontSize: StyleConstants.smallFont,
    color: '#333333',
    marginTop: StyleConstants.smallMargin,
  },
  inputContainer: {
    justifyContent: 'center',
    marginTop: StyleConstants.baseMargin,
  },
  input: {
    color: BaseColors.black,
    backgroundColor: BaseColors.lightWhite,
    borderRadius: StyleConstants.borderRadius,
    padding: 20,
    paddingLeft: '12%',
    fontFamily: Fonts.secondary,
    fontSize: StyleConstants.smallFont,
  },
  svg: {
    width: normalize.width(18),
    height: normalize.width(18),
    position: 'absolute',
    left: '3%',
    zIndex: 100,
  },
});
export default ForgotPassword;

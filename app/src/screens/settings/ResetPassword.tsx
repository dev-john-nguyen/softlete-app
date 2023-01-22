import React, { useState } from 'react';
import StyleConstants from '../../components/tools/StyleConstants';
import auth from '@react-native-firebase/auth';
import PrimaryButton from '../../components/elements/PrimaryButton';
import { validateEmail } from '../../utils/tools';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { Input, PrimaryText } from '@app/elements';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onResetPassword = () => {
    if (!email || !validateEmail(email)) return setErr('Invalid email.');

    const user = auth().currentUser;

    if (!user) return setErr('Please logout and login to reset password.');

    const authEmail = user.email;

    if (email.toLowerCase() !== authEmail?.toLowerCase())
      return setErr(
        "Looks like you use a differen't email address for this account.",
      );

    setLoading(true);

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setSent(true);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setErr('Failed to send email to your email address. Please try again.');
        setLoading(false);
      });
  };

  return (
    <ScreenTemplate headerPadding>
      <FlexBox flexDirection="column" padding={20} paddingTop={5}>
        <FlexBox marginBottom={10} flexDirection="column">
          <PrimaryText fontSize={20}>Reset Password</PrimaryText>
          {!!err && (
            <PrimaryText
              variant="secondary"
              fontSize={12}
              color={Colors.red}
              marginTop={5}>
              *{err}
            </PrimaryText>
          )}
        </FlexBox>
        <Input
          label="Confirm Email"
          onChangeText={txt => setEmail(txt)}
          value={email}
          styles={{ marginBottom: StyleConstants.baseMargin }}
          placeholder="keisha_smith@softlete.com"
          autoCapitalize="none"
        />
        <PrimaryButton onPress={onResetPassword} loading={loading}>
          {sent ? 'Email Sent' : 'Send'}
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default ResetPassword;

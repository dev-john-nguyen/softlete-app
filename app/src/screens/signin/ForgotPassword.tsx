import React, { useCallback, useMemo, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { validateEmail } from '../../utils/tools';
import {
  Input,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { Colors } from '@app/utils';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import useBanner from 'src/hooks/utils/useBanner';
import { BannerTypes } from 'src/services/banner/types';

interface Props {
  onGoBack: () => void;
}

const ForgotPassword = ({ onGoBack }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const setBanner = useBanner();

  const onSendResetPassword = useCallback(() => {
    if (!email || !validateEmail(email) || loading)
      return setBanner('Please enter a valid email.', BannerTypes.error);

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
        setBanner(
          'Failed to send instructions to this email. This email might not be registered with us. Please try again.',
          BannerTypes.error,
        );
      });
  }, [email, loading, setBanner]);

  const contentElement = useMemo(() => {
    if (sent) {
      return (
        <FlexBox column>
          <FlexBox alignItems="center" justifyContent="center">
            <Icon icon="send_mail" size={100} color={Colors.white} />
          </FlexBox>
          <PrimaryText bold size="medium">
            Please check your email!
          </PrimaryText>
          <PrimaryText>
            The instructions have been sent to your email. Please follow the
            instructions to reset your password.
          </PrimaryText>
        </FlexBox>
      );
    }
    return (
      <FlexBox column>
        <PrimaryText marginBottom={20}>
          {`Enter the email associated with your account and we'll send an email with instructions to reset your password.`}
        </PrimaryText>
        <Input
          placeholder="Email"
          icon="mail"
          onChangeText={txt => setEmail(txt.trim())}
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <PrimaryButton
          marginTop={20}
          onPress={onSendResetPassword}
          loading={loading}>
          Send Instructions
        </PrimaryButton>
      </FlexBox>
    );
  }, [loading, onSendResetPassword, sent]);

  return (
    <ScreenTemplate
      isBackVisible
      onGoBack={onGoBack}
      headerTitleFormatted="Reset Password"
      applyContentPadding>
      {contentElement}
    </ScreenTemplate>
  );
};

export default ForgotPassword;

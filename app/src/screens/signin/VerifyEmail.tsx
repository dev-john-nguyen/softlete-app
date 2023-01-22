import React, { useEffect, useRef, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { connect, useDispatch } from 'react-redux';
import { logout } from '../../services/user/actions';
import PrimaryText from '../../components/elements/PrimaryText';
import { BannerTypes } from '../../services/banner/types';
import useBanner from 'src/hooks/utils/useBanner';
import { PrimaryButton, ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from '@app/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const VerifyEmail = () => {
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const mount = useRef(false);
  const setBanner = useBanner();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      sendEmailVerification();
    }
  }, []);

  const sendEmailVerification = () => {
    const { currentUser } = auth();

    if (!currentUser) return onLogoutHandler();

    if (!sent) {
      setSent(true);
      currentUser
        .sendEmailVerification()
        .then(() => {
          setTimeout(() => {
            mount.current && setSent(false);
          }, 20000);
        })
        .catch(err => {
          console.log(err);
          if (mount.current) {
            setBanner(
              'Unexpected error occurred while sending your email verification. Please try refreshing the app.',
              BannerTypes.error,
              2,
            );
            setSent(false);
          }
        });
    }
  };

  const onVerify = async () => {
    if (auth().currentUser) {
      await auth().currentUser?.reload();
      if (auth().currentUser?.emailVerified) {
        setBanner('Email Verified. Please login again.', BannerTypes.default);
        onLogoutHandler();
      }
    }
  };

  const onLogoutHandler = () => dispatch(logout());

  const onDone = async () => {
    if (verified) return;
    setVerified(true);
    await onVerify().catch(err => {
      console.log(err);
      if (mount.current) {
        setBanner(
          'Unexpected error occurred while verifying your email. Please try refreshing the app.',
          BannerTypes.error,
          2,
        );
      }
    });
    setVerified(false);
  };

  return (
    <ScreenTemplate applyContentPadding>
      <FlexBox column padding={15} alignItems="center">
        <PrimaryText bold variant="primary" fontSize={30} marginBottom={10}>
          Verfiy your Email
        </PrimaryText>
        <PrimaryText marginBottom={5}>
          Shortly you should receive an email. Please follow the directions in
          the email to verify your email.
        </PrimaryText>
        <FlexBox marginBottom={20} width="100%">
          <PrimaryText>Email: </PrimaryText>
          <PrimaryText bold>{auth().currentUser?.email}</PrimaryText>
        </FlexBox>
        <Icon icon="send_mail" size={100} color={Colors.white} />
        <FlexBox width="100%" column marginTop={20}>
          <PrimaryButton onPress={onDone} marginBottom={10}>
            {verified ? 'Refreshing...' : 'I verified my email'}
          </PrimaryButton>
          {!sent && (
            <PrimaryButton
              onPress={sendEmailVerification}
              styles={{
                color: sent ? Colors.secondary : Colors.black,
                marginTop: 10,
              }}
              marginBottom={10}
              variant="secondary">
              Resend Verification Email
            </PrimaryButton>
          )}
        </FlexBox>
        <FlexBox width="100%" marginTop={10}>
          <PrimaryText>
            If the email you registered with is invalid, Please logout and
            re-register with the correct email.
          </PrimaryText>
        </FlexBox>
        <FlexBox marginTop={10} width="100%">
          <TouchableOpacity onPress={onLogoutHandler}>
            <PrimaryText textDecorationLine="underline">Logout</PrimaryText>
          </TouchableOpacity>
        </FlexBox>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default connect()(VerifyEmail);

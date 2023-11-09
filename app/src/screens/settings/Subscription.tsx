import React from 'react';
import { ReducerProps } from '../../services';
import { useSelector } from 'react-redux';
import Products from '../../utils/Products';
import ScreenTemplate from '../../components/elements/screen-template';
import { PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors, rgba } from '@app/utils';

const Subscription = () => {
  const user = useSelector((state: ReducerProps) => state.user);
  const renderSubscription = () => {
    if (user.subscriptionType) {
      switch (user.subscriptionType) {
        case Products.monthlyId_00_99:
          return '$0.99';
        case Products.monthlyId_05_99:
          return '$5.99';
        default:
          return 'Free';
      }
    }
    return 'Free';
  };

  return (
    <ScreenTemplate
      isBackVisible
      headerTitleFormatted="Subscription"
      applyContentPadding>
      <PrimaryText fontSize={14} variant="secondary" bold marginBottom={5}>
        All Access ({renderSubscription()}) Subscription
      </PrimaryText>
      <PrimaryText
        variant="secondary"
        color={rgba(Colors.whiteRbg, 0.8)}
        marginBottom={20}>
        With this subscription you have all access to the tools that we offer.
        Thank you for subscribing :).
      </PrimaryText>
      <PrimaryText fontSize={14} variant="secondary" bold marginBottom={5}>
        How To Update Subscription?
      </PrimaryText>
      <PrimaryText variant="secondary" color={rgba(Colors.whiteRbg, 0.8)}>
        To update your subscription, go to settings on your phone, tap the My
        Account button or your profile picture at the top right, then tap
        Subscriptions. You can change or cancel an existing subscription, or
        resubscribe to an expired subscription.
      </PrimaryText>
    </ScreenTemplate>
  );
};

export default Subscription;

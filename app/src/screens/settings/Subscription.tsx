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
        The app is currently free to use.
      </PrimaryText>
    </ScreenTemplate>
  );
};

export default Subscription;

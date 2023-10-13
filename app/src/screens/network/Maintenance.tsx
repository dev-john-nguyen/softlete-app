import React from 'react';
import PrimaryText from '../../components/elements/PrimaryText';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

const Maintenance = () => {
  return (
    <ScreenTemplate applyContentPadding>
      <FlexBox flex={1} column alignItems="center">
        <PrimaryText bold fontSize={30} variant="primary" marginBottom={5}>
          Softlete Social
        </PrimaryText>
        <PrimaryText>
          Cultivate connections with fellow athletes, stay updated on their
          training regimens, explore and download training programs/workouts
          from others.
        </PrimaryText>
        <FlexBox flex={1} column alignItems="center" marginTop={20}>
          <Icon icon="world" size={120} color={Colors.lightWhite} />
          <PrimaryText bold fontSize={30} marginTop={20}>
            Coming Soon!
          </PrimaryText>
        </FlexBox>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default Maintenance;

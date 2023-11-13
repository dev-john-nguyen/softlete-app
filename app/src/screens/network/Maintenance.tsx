import React from 'react';
import PrimaryText from '../../components/elements/PrimaryText';
import ScreenTemplate from '../../components/elements/screen-template';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

const Maintenance = () => {
  return (
    <ScreenTemplate applyContentPadding>
      <FlexBox flex={1} column justifyContent="center">
        <FlexBox column bottom={50}>
          <PrimaryText bold fontSize={50} variant="primary">
            Social Networking
          </PrimaryText>
          <PrimaryText>
            Cultivate connections with fellow athletes, stay updated on their
            training regimens, explore and download training programs/workouts
            from others. Coming soon.
          </PrimaryText>
        </FlexBox>
        <FlexBox
          marginTop={100}
          alignItems="center"
          justifyContent="center"
          position="absolute"
          right={-50}
          top={0}
          opacity={0.1}>
          <Icon icon="world" color={Colors.white} size={500} />
        </FlexBox>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default Maintenance;

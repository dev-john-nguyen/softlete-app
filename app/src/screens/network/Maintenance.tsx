import React from 'react';
import PrimaryText from '../../components/elements/PrimaryText';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

const Maintenance = () => {
  return (
    <ScreenTemplate>
      <FlexBox flex={1} column alignItems="center" justifyContent="center">
        <PrimaryText bold fontSize={30} variant="primary" marginBottom={5}>
          Softlete Social
        </PrimaryText>
        <Icon icon="world" size={100} color={Colors.lightWhite} />
        <PrimaryText bold size="large" marginTop={20}>
          Coming Soon!
        </PrimaryText>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default Maintenance;

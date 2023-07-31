import React, { FC } from 'react';
import { ProgramProps } from '../../services/program/types';
import PrimaryText from '../elements/PrimaryText';
import { ScrollView } from 'react-native-gesture-handler';
import { FlexBox } from '@app/ui';

interface Props {
  name: ProgramProps['name'];
  description: ProgramProps['description'];
}

const ProgramHeader: FC<Props> = ({ name, description }) => {
  return (
    <FlexBox column marginBottom={10} paddingLeft={15} paddingRight={15}>
      <PrimaryText
        size="medium"
        variant="primary"
        textTransform="capitalize"
        bold>
        {name}
      </PrimaryText>
      <FlexBox maxHeight={25}>
        <ScrollView>
          <PrimaryText>{description}</PrimaryText>
        </ScrollView>
      </FlexBox>
    </FlexBox>
  );
};

export default ProgramHeader;

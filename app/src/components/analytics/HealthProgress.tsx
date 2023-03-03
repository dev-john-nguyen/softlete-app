import { HealthCircle } from '@app/elements';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import React from 'react';
import { AnalyticsProps } from '../../services/misc/types';

interface Props {
  analytics?: AnalyticsProps;
}

const HealthProgress = ({ analytics }: Props) => {
  return (
    <FlexBox
      width="100%"
      justifyContent="space-evenly"
      marginTop={10}
      paddingBottom={15}>
      <HealthCircle
        name="Minimum"
        value={analytics?.analytics?.min.toString() || '0'}
        progress={0.05}
        progressColor={Colors.green}
        index={0}
        small
      />
      <HealthCircle
        name="Average"
        value={analytics?.analytics?.avg.toString() || '0'}
        progress={0.5}
        progressColor={Colors.green}
        index={0}
        small
      />
      <HealthCircle
        name="Maximum"
        value={analytics?.analytics?.max.toString() || '0'}
        progress={1}
        progressColor={Colors.green}
        index={0}
        small
      />
    </FlexBox>
  );
};

export default HealthProgress;

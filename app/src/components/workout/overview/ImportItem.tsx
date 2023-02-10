import React, { useMemo } from 'react';
import { FlexBox } from '@app/ui';
import { HealthDataProps } from 'src/services/workout/types';
import HealthContainer from './HealthContainer';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { PrimaryText } from '@app/elements';

interface Props {
  onImportData: () => void;
  data: HealthDataProps;
}

const ImportItem = ({ data, onImportData }: Props) => {
  const formattedData: HealthDataProps = useMemo(() => {
    return {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      activityId: data.activityId,
      heartRates: data.heartRates,
      date: data.date,
    };
  }, [data]);

  return (
    <FlexBox column marginBottom={10}>
      <FlexBox justifyContent="flex-end" marginBottom={5} alignItems="center">
        <Icon
          icon="download"
          onPress={onImportData}
          size={25}
          color={Colors.white}
        />
      </FlexBox>
      <HealthContainer data={formattedData} />
    </FlexBox>
  );
};

export default ImportItem;

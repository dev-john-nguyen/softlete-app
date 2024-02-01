import React, { FC, useMemo } from 'react';
import { FlexBox } from '@app/ui';
import { ScrollView } from 'react-native';
import { useFetchHealthData } from '../../hooks/fetch-health-data.hooks';
import DeviceHealthImportItem from '../../components/DeviceHealthImportItem';
import { HealthDataProps } from 'src/services/workout/types';

type Props = {
  onImportHealthData: (data: HealthDataProps) => Promise<void>;
};

const ImportDeviceActivities: FC<Props> = ({ onImportHealthData }) => {
  const { data } = useFetchHealthData();

  const renderDataOptions = useMemo(() => {
    return data.map((item, i) => (
      <DeviceHealthImportItem
        data={item}
        onImportData={onImportHealthData}
        key={item.activityId ? item.activityId : i}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <FlexBox column flex={1}>
      <ScrollView
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {renderDataOptions}
      </ScrollView>
    </FlexBox>
  );
};

export default ImportDeviceActivities;

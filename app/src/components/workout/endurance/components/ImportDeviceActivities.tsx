import React, { FC, useMemo } from 'react';
import { FlexBox } from '@app/ui';
import { ScrollView } from 'react-native';
import { useFetchHealthData } from '../../hooks/fetch-health-data.hooks';
import DeviceHealthImportItem from '../../components/DeviceHealthImportItem';
import { HealthDataProps } from 'src/types/workouts.types';
import { ChevronNavigationButton, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { useWorkoutState } from '@app/contexts';

type Props = {
  onImportHealthData: (data: HealthDataProps) => Promise<void>;
  onCancel: () => void;
};

const ImportDeviceActivities: FC<Props> = ({
  onImportHealthData,
  onCancel,
}) => {
  const { data } = useFetchHealthData();
  const { workout } = useWorkoutState();

  const renderDataOptions = useMemo(() => {
    return data.map((item, i) => (
      <DeviceHealthImportItem
        data={item}
        onImportData={onImportHealthData}
        key={item.activityId ? item.activityId : i}
        workout={workout}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, workout]);

  return (
    <FlexBox column flex={1}>
      <ChevronNavigationButton
        onPress={onCancel}
        label="Back to Menu"
        alignSelf="flex-start"
      />
      {renderDataOptions.length === 0 ? (
        <FlexBox flex={1} alignItems="center" justifyContent="center">
          <Icon
            size={100}
            icon="upload"
            color={Colors.white}
            containerStyles={{ opacity: 0.2, position: 'absolute' }}
          />
          <PrimaryText fontSize={40} variant="primary">
            Empty
          </PrimaryText>
        </FlexBox>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {renderDataOptions}
        </ScrollView>
      )}
    </FlexBox>
  );
};

export default ImportDeviceActivities;

import { InfoListBox } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import _ from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { HealthDataProps, WorkoutProps } from '../../../services/workout/types';
import AutoId from '../../../utils/AutoId';
import { useFetchHealthData } from 'src/components/workout/hooks/fetch-health-data.hooks';
import DeviceHealthImportItem from 'src/components/workout/components/DeviceHealthImportItem';
import HealthForm from 'src/components/workout/overview/HealthForm';
import HealthContainer from 'src/components/workout/overview/HealthContainer';

interface Props {
  onImportData: (data: HealthDataProps) => Promise<void>;
  workout: WorkoutProps;
}

const DeviceHealthImport = ({ onImportData, workout }: Props) => {
  const [custom, setCustom] = useState(false);
  const [customId] = useState(AutoId.newId(10));
  const [editImport, setEditImport] = useState(false);
  const { data } = useFetchHealthData(workout);

  const onCustomStateChange = () => setCustom(m => (m ? false : true));

  const onCustomImportSubmit = async (data: HealthDataProps) => {
    const dataInsert = {
      ...data,
      activityId: customId,
      activityName: workout.type,
    };
    await onImportData(dataInsert);
    setCustom(false);
  };

  const onImportDataHandler = async (data: HealthDataProps) => {
    await onImportData(data).catch(error => {
      console.error(error);
    });
    setEditImport(false);
  };

  const renderDataOptions = useMemo(() => {
    return data.map((item, i) => (
      <DeviceHealthImportItem
        data={item}
        onImportData={onImportDataHandler}
        key={item.activityId ? item.activityId : i}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (custom) {
    return (
      <FlexBox flex={1} column margin={15}>
        <HealthForm
          onSubmit={onCustomImportSubmit}
          onClose={onCustomStateChange}
          activityName={workout.type}
          healthData={workout.healthData} // only set the default data if it's program
        />
      </FlexBox>
    );
  }

  return (
    <FlexBox column flex={1}>
      <FlexBox
        padding={6}
        borderRadius={100}
        borderWidth={1}
        borderColor={Colors.white}
        alignSelf="flex-end"
        marginBottom={5}
        onPress={() => setEditImport(isVisible => !isVisible)}>
        <Icon
          icon={editImport ? 'close' : 'pencil'}
          size={10}
          direction="left"
          color={Colors.white}
        />
      </FlexBox>
      <FlexBox column marginBottom={10}>
        <HealthContainer data={workout.healthData} workout={workout} />
      </FlexBox>
      {editImport && (
        <FlexBox column flex={1}>
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {renderDataOptions}
            <InfoListBox
              secondary
              icon="devices"
              label="Source"
              desc="Custom Health Statistics"
              onPress={onCustomStateChange}
            />
          </ScrollView>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default DeviceHealthImport;

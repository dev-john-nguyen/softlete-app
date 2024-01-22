import { InfoListBox } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import _ from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { HealthObserver } from 'react-native-health';
import {
  HealthDataProps,
  WorkoutStatus,
} from '../../../services/workout/types';
import AutoId from '../../../utils/AutoId';
import HealthForm from './HealthForm';
import HealthContainer from './HealthContainer';
import { WorkoutContext } from '@app/contexts';
import WorkoutReflection from '../WorkoutReflection';
import { useFetchHealthData } from '../hooks/fetch-health-data.hooks';
import DeviceHealthImportItem from '../components/DeviceHealthImportItem';

interface Props {
  type?: HealthObserver;
  onImportData: (data: HealthDataProps) => Promise<void>;
  hide?: boolean;
}

const HealthImportContainer = ({ type: type, onImportData }: Props) => {
  const [custom, setCustom] = useState(false);
  const [customId] = useState(AutoId.newId(10));
  const [deviceWosIsVisible, setDeviceWosIsVisible] = useState(false);
  const mount = useRef(false);
  const { workout, isProgram } = useContext(WorkoutContext);
  const { data } = useFetchHealthData(type);

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const onCustomStateChange = () => setCustom(m => (m ? false : true));

  const onCustomImportSubmit = async (data: HealthDataProps) => {
    const dataInsert = {
      ...data,
      activityId: customId,
      activityName: workout.type,
    };
    await onImportData(dataInsert);
    if (mount.current) {
      setCustom(false);
    }
  };

  const onImportDataHandler = async (data: HealthDataProps) => {
    await onImportData(data).catch(error => {
      console.error(error);
    });
    setDeviceWosIsVisible(false);
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

  if (custom || isProgram) {
    return (
      <FlexBox flex={1} column margin={15}>
        <HealthForm
          onSubmit={onCustomImportSubmit}
          onClose={isProgram ? undefined : onCustomStateChange}
          activityName={workout.type}
          healthData={isProgram ? workout.healthData : undefined} // only set the default data if it's program
        />
      </FlexBox>
    );
  }

  return (
    <FlexBox column margin={15} marginTop={0} marginBottom={0} flex={1}>
      <FlexBox
        padding={6}
        borderRadius={100}
        borderWidth={1}
        borderColor={Colors.white}
        alignSelf="flex-end"
        marginBottom={5}
        onPress={() => setDeviceWosIsVisible(isVisible => !isVisible)}>
        <Icon
          icon={deviceWosIsVisible ? 'close' : 'pencil'}
          size={10}
          direction="left"
          color={Colors.white}
        />
      </FlexBox>
      <FlexBox column marginBottom={10}>
        <HealthContainer
          data={workout.healthData}
          workout={workout}
          isProgram={isProgram}
        />
      </FlexBox>
      {deviceWosIsVisible ? (
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
      ) : (
        workout.status === WorkoutStatus.completed && <WorkoutReflection />
      )}
    </FlexBox>
  );
};

export default HealthImportContainer;

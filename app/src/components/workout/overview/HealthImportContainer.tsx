import { InfoListBox } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors } from '@app/utils';
import _ from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import AppleHealthKit, {
  HealthInputOptions,
  HealthObserver,
  HealthValue,
} from 'react-native-health';
import { getWoSample } from '../../../helpers/health.helpers';
import {
  HealthDataProps,
  WorkoutStatus,
} from '../../../services/workout/types';
import AutoId from '../../../utils/AutoId';
import HealthForm from './HealthForm';
import HealthContainer from './HealthContainer';
import { WorkoutContext } from '@app/contexts';
import WorkoutReflection from '../WorkoutReflection';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';

interface ImportItemProps {
  onImportData: (data: HealthDataProps) => Promise<void>;
  data: HealthDataProps;
}

const ImportItem = ({ data, onImportData }: ImportItemProps) => {
  const { workout } = useContext(WorkoutContext);
  const isWorkoutData = workout.healthData?.activityId === data.activityId;
  const { isLoading, mutateAsync } = useMutation(() => {
    return onImportData(data);
  });

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
      <FlexBox
        alignSelf="flex-end"
        justifyContent="flex-end"
        marginBottom={5}
        alignItems="center"
        paddingBottom={5}
        paddingTop={5}>
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Icon
            icon={isWorkoutData ? 'checkmark' : 'download'}
            onPress={() => !isWorkoutData && mutateAsync()}
            size={20}
            color={Colors[isWorkoutData ? 'green' : 'white']}
          />
        )}
      </FlexBox>
      <HealthContainer data={formattedData} />
    </FlexBox>
  );
};

interface Props {
  type?: HealthObserver;
  onImportData: (data: HealthDataProps) => Promise<void>;
  hide?: boolean;
}

const HealthImportContainer = ({ type: type, onImportData }: Props) => {
  const [data, setData] = useState<HealthDataProps[]>([]);
  const [custom, setCustom] = useState(false);
  const [customId] = useState(AutoId.newId(10));
  const [deviceWosIsVisible, setDeviceWosIsVisible] = useState(false);
  const mount = useRef(false);
  const { workout, isProgram } = useContext(WorkoutContext);

  const getActiveEnergy = async () => {
    if (!workout.date) return;
    const d = new Date(workout.date);

    const options = {
      startDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getUTCDate(),
        0,
      ).toISOString(),
      endDate: new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getUTCDate(),
        24,
      ).toISOString(),
      type,
    };

    try {
      const woSamples = await getWoSample(options);
      fetchHeartRateData(woSamples);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getActiveEnergy();
  }, [workout]);

  useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);

  const fetchHeartRateData = async (healthData: HealthDataProps[]) => {
    if (healthData.length < 1) return;

    const dataToFetchHR = healthData.filter(d => d.start && d.end);

    if (dataToFetchHR.length < 1) return;

    interface StoreProps {
      heartRates: number[];
      activityId: string;
    }

    const heartRateStore: StoreProps[] = [];

    for (let i = 0; i < dataToFetchHR.length; i++) {
      const item = dataToFetchHR[i];
      if (item.start && item.end) {
        try {
          const heartRates = await getHeartRateSample(item.start, item.end);
          heartRateStore.push({
            activityId: item.activityId,
            heartRates: heartRates.map(h => h.value),
          });
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (heartRateStore.length > 0) {
      if (!mount.current) return;

      setData(d => {
        const h = healthData.map(i => {
          const heartRates = heartRateStore.find(
            h => h.activityId === i.activityId,
          );
          return {
            ...i,
            heartRates: heartRates ? heartRates.heartRates : undefined,
          };
        });
        return _.uniqBy([...h, ...d], 'activityId');
      });
    }
  };

  const getHeartRateSample = async (startDate: string, endDate: string) => {
    return new Promise((resolve, reject) => {
      const options = {
        unit: 'bpm',
        startDate: startDate,
        endDate: endDate,
        limit: 100,
        ascending: false,
      } as HealthInputOptions;

      AppleHealthKit.getHeartRateSamples(
        options,
        (err: any, results: Array<HealthValue>) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        },
      );
    }) as Promise<HealthValue[]>;
  };

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
      <ImportItem
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

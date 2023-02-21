import { InfoListBox, Input, PrimaryText } from '@app/elements';
import Icon from '@app/icons';
import { FlexBox } from '@app/ui';
import { Colors, normalize, StyleConstants } from '@app/utils';
import _ from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import AppleHealthKit, {
  HealthInputOptions,
  HealthObserver,
  HealthValue,
} from 'react-native-health';
import { getWoSample } from '../../../helpers/health.helpers';
import {
  HealthDataProps,
  WorkoutProps,
  WorkoutStatus,
} from '../../../services/workout/types';
import AutoId from '../../../utils/AutoId';
import Constants from '../../../utils/Constants';
import HealthForm from './HealthForm';
import HealthContainer from './HealthContainer';
import ImportItem from './ImportItem';
import { HomeWorkoutContext } from '@app/contexts';
import { Pressable, Keyboard, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import ReflectionImage from './ReflectionImage';
import { ImageProps } from 'src/services/user/types';

interface WorkoutReflectionProps {
  setImage: (img: ImageProps) => void;
  image?: ImageProps;
}

const WorkoutReflection = ({ image, setImage }: WorkoutReflectionProps) => {
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
  }));

  const { setReflection } = useContext(HomeWorkoutContext);

  return (
    <FlexBox column>
      <Pressable onPress={() => Keyboard.dismiss()}>
        {workout.status === WorkoutStatus.inProgress && (
          <Input
            label="How was the workout?"
            onChangeText={txt => setReflection?.(txt)}
            defaultValue={workout.reflection}
            placeholder="Write a caption..."
            multiline={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            maxLength={150}
            styles={{
              marginBottom: StyleConstants.baseMargin,
              borderRadius: 0,
            }}
          />
        )}
        <ReflectionImage
          setImage={setImage}
          image={image}
          imageUri={workout.imageUri ? workout.imageUri : workout.localImageUri}
          allowUpload={workout.status === WorkoutStatus.inProgress}
        />
        {workout.status === WorkoutStatus.completed && (
          <FlexBox marginTop={10}>
            <ScrollView>
              <View onStartShouldSetResponder={() => true}>
                <PrimaryText>{workout.reflection}</PrimaryText>
              </View>
            </ScrollView>
          </FlexBox>
        )}
      </Pressable>
    </FlexBox>
  );
};

interface Props {
  workout: WorkoutProps;
  type?: HealthObserver;
  onImportData: (data: HealthDataProps) => void;
  hide?: boolean;
  image?: ImageProps;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}

const HealthImportContainer = ({
  workout,
  type: type,
  onImportData,
  image,
  setImage,
}: Props) => {
  const [data, setData] = useState<HealthDataProps[]>([]);
  const [custom, setCustom] = useState(false);
  const [customId] = useState(AutoId.newId(10));
  const [deviceWosIsVisible, setDeviceWosIsVisible] = useState(false);
  const mount = useRef(false);

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

  const getActiveEnergy = async () => {
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

  const onCustomStateChange = () => setCustom(m => (m ? false : true));

  const onCustomImportSubmit = (data: HealthDataProps) => {
    const dataInsert = {
      ...data,
      activityId: customId,
      activityName: workout.type,
    };
    setData(d => {
      const dupIndex = d.findIndex(i => i.activityId === customId);
      if (dupIndex > -1) {
        d[dupIndex] = dataInsert;
      } else {
        d.push(dataInsert);
      }
      return [...d];
    });
    setCustom(false);
  };

  const renderDate = () => {
    const d = new Date(workout.date);
    return (
      <FlexBox justifyContent="space-between" marginBottom={10}>
        <PrimaryText size="small">
          {Constants.months[d.getMonth()] +
            ' ' +
            d.getDate() +
            ', ' +
            d.getFullYear()}
        </PrimaryText>
        <PrimaryText size="small" textTransform="capitalize">
          {Constants.daysOfWeek[d.getDay()]}
        </PrimaryText>
      </FlexBox>
    );
  };

  const renderDataOptions = useCallback(() => {
    return data.map((item, i) => (
      <ImportItem
        data={item}
        onImportData={() => onImportData(item)}
        key={item.activityId ? item.activityId : i}
      />
    ));
  }, [data]);

  if (custom) {
    return (
      <FlexBox flex={1} column margin={15}>
        {renderDate()}
        <HealthForm
          onSubmit={onCustomImportSubmit}
          onClose={onCustomStateChange}
          activityName={workout.type}
        />
      </FlexBox>
    );
  }

  return (
    <FlexBox column margin={15} marginTop={0} marginBottom={0} flex={1}>
      {workout.status !== WorkoutStatus.inProgress && (
        <FlexBox
          padding={6}
          borderRadius={100}
          borderWidth={1}
          borderColor={Colors.white}
          alignSelf="flex-start"
          marginBottom={5}
          onPress={() => setDeviceWosIsVisible(isVisible => !isVisible)}>
          <Icon
            icon={deviceWosIsVisible ? 'close' : 'pencil'}
            size={10}
            direction="left"
            color={Colors.white}
          />
        </FlexBox>
      )}
      <FlexBox column marginBottom={10}>
        <HealthContainer data={workout.healthData} workout={workout} />
      </FlexBox>
      {deviceWosIsVisible ? (
        <FlexBox column flex={1}>
          {renderDate()}
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {renderDataOptions()}
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
        workout.status !== WorkoutStatus.pending && (
          <WorkoutReflection image={image} setImage={setImage} />
        )
      )}
    </FlexBox>
  );
};

export default HealthImportContainer;

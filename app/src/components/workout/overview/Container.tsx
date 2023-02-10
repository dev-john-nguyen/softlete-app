import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { View, Pressable, Keyboard, ScrollView } from 'react-native';
import {
  HealthDataProps,
  HealthDisMeas,
  ViewWorkoutProps,
  WorkoutActionProps,
  WorkoutStatus,
} from '../../../services/workout/types';
import { ImageProps } from '../../../services/user/types';
import AutoId from '../../../utils/AutoId';
import HealthContainer from './HealthContainer';
import HealthImportContainer from './HealthImportContainer';
import AppleHealthKit from 'react-native-health';
import HealthForm from './HealthForm';
import { capitalize, normalize } from '../../../utils/tools';
import _ from 'lodash';
import { HomeWorkoutContext } from '@app/contexts';
import { Input, PrimaryText } from '@app/elements';
import { FlexBox } from '@app/ui';
import { useSelector } from 'react-redux';
import { ReducerProps } from 'src/services';
import ReflectionImage from './ReflectionImage';
import Icon from '@app/icons';
import { Colors, StyleConstants } from '@app/utils';

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
    <FlexBox column margin={15} marginTop={0}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <ReflectionImage
          setImage={setImage}
          image={image}
          imageUri={workout.imageUri ? workout.imageUri : workout.localImageUri}
          allowUpload={workout.status === WorkoutStatus.inProgress}
        />
        {workout.status === WorkoutStatus.completed ? (
          <FlexBox height={normalize.height(12)} marginTop={10}>
            <ScrollView>
              <View onStartShouldSetResponder={() => true}>
                <PrimaryText>{workout.reflection}</PrimaryText>
              </View>
            </ScrollView>
          </FlexBox>
        ) : (
          <Input
            onChangeText={txt => setReflection?.(txt)}
            placeholder="Write a caption..."
            multiline={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={true}
            maxLength={200}
            styles={{ marginTop: StyleConstants.baseMargin, borderRadius: 0 }}
          />
        )}
      </Pressable>
    </FlexBox>
  );
};

interface Props {
  navigation?: any;
  workout: ViewWorkoutProps;
  updateWoHealthData?: WorkoutActionProps['updateWoHealthData'];
  athlete?: boolean;
  image?: ImageProps;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}

const OverviewContainer = ({
  navigation,
  workout,
  updateWoHealthData,
  athlete,
  image,
  setImage,
}: Props) => {
  const [showImport, setShowImport] = useState(false);
  const [healthData, setHealthData] = useState<HealthDataProps>();
  const mount = useRef(false);

  useLayoutEffect(() => {
    navigation &&
      navigation.setOptions({
        headerTitle: workout.name ? capitalize(workout.name) : '',
      });
  }, [workout, navigation]);

  useEffect(() => {
    mount.current = true;
    if (workout.healthData) {
      setHealthData(workout.healthData);
    } else {
      setHealthData({
        activityName: workout.type,
        sourceName: 'Custom',
        calories: 0,
        duration: 0,
        distance: 0,
        disMeas: HealthDisMeas.mi,
        heartRates: [],
        activityId: AutoId.newId(20),
        date: workout.date,
      });
    }
    return () => {
      mount.current = false;
    };
  }, [workout]);

  const onImportData = (data: HealthDataProps) =>
    updateWoHealthData &&
    updateWoHealthData(workout._id, data).catch(err => console.log(err));

  const onChangeShowImportState = () => setShowImport(i => (i ? false : true));

  const onChangeHealthData = (data: HealthDataProps) => {
    //check if there is a difference
    if (workout.healthData) {
      const { healthData: woHltDta } = workout;
      if (
        data.activityName === woHltDta.activityName &&
        data.sourceName === woHltDta.sourceName &&
        data.distance === woHltDta.distance &&
        data.calories === woHltDta.calories &&
        data.duration === woHltDta.duration &&
        data.disMeas === woHltDta.disMeas &&
        _.isEqual(data.heartRates, woHltDta.heartRates)
      )
        return;
    }

    const dataObj: HealthDataProps = {
      activityName: data.activityName,
      sourceName: data.sourceName,
      duration: data.duration,
      calories: data.calories,
      distance: data.distance,
      heartRates: data.heartRates,
      disMeas: HealthDisMeas.mi,
      activityId: data.activityId,
      date: workout.date,
    };
    onImportData(dataObj);
    setHealthData({ ...dataObj, _id: AutoId.newId(10) });
    setShowImport(false);
  };

  const renderHealthComponents = () => {
    if (showImport) return;
    if (athlete)
      return (
        <FlexBox column margin={15} marginTop={5}>
          <HealthContainer data={healthData} />
        </FlexBox>
      );
    switch (workout.status) {
      case WorkoutStatus.pending:
        return (
          <FlexBox column margin={15} marginTop={5}>
            <HealthForm
              onSubmit={onChangeHealthData}
              healthData={healthData}
              activityName={workout.type}
            />
            <FlexBox column>
              <PrimaryText bold>Quick Tip</PrimaryText>
              <PrimaryText>
                Use the above actions to set goals for your training.
              </PrimaryText>
            </FlexBox>
          </FlexBox>
        );
      case WorkoutStatus.completed:
        return (
          <FlexBox column margin={15} marginTop={5}>
            <FlexBox
              padding={5}
              borderRadius={100}
              borderWidth={1}
              borderColor={Colors.white}
              alignSelf="flex-start"
              marginBottom={5}>
              <Icon
                icon={showImport ? 'close' : 'pencil'}
                size={12}
                onPress={onChangeShowImportState}
                color={Colors.white}
              />
            </FlexBox>
            <HealthContainer data={healthData} />
          </FlexBox>
        );
    }
  };

  if (workout.programTemplateUid) {
    return (
      <FlexBox flex={1} column margin={15} marginTop={5}>
        {athlete ? (
          <>
            <FlexBox column>
              <PrimaryText bold>Target Goals</PrimaryText>
            </FlexBox>
            <HealthContainer data={healthData} />
          </>
        ) : (
          <>
            <HealthForm
              onSubmit={onChangeHealthData}
              healthData={healthData}
              activityName={workout.type}
            />
            <FlexBox column>
              <PrimaryText bold>Note</PrimaryText>
              <PrimaryText>Set target goals for your workout.</PrimaryText>
            </FlexBox>
          </>
        )}
      </FlexBox>
    );
  }

  return (
    <FlexBox screenWidth column flex={1} zIndex={100}>
      <HealthImportContainer
        workout={workout}
        type={AppleHealthKit.Constants.Observers.Workout}
        onImportData={onChangeHealthData}
        hide={!showImport}
        onChangeShowImportState={onChangeShowImportState}
      />

      {renderHealthComponents()}
      {workout.status !== WorkoutStatus.pending && !showImport && (
        <WorkoutReflection image={image} setImage={setImage} />
      )}
    </FlexBox>
  );
};

export default OverviewContainer;

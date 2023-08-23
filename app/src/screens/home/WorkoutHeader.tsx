import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlexBox } from '@app/ui';
import {
  Input,
  PickerButton,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { connect, useSelector } from 'react-redux';
import { Keyboard } from 'react-native';
import { ReducerProps } from '../../services';
import {
  WorkoutActionProps,
  WorkoutHeaderProps,
  WorkoutTypes,
} from '../../services/workout/types';
import DateTools from '../../utils/DateTools';
import { capitalize } from '../../utils/tools';
import { updateWorkoutHeader } from '../../services/workout/actions';
import { updateProgramWorkoutHeader } from '../../services/program/actions';
import { HomeStackScreens } from './types';
import { HealthActivity } from 'react-native-health';
import { renderHealthActivityName } from '../../utils/format';
import DashboardDemo from '../../components/demo/Demo';
import useBanner from 'src/hooks/utils/useBanner';
import { RouteProp } from '@react-navigation/native';

interface Props {
  route: RouteProp<any>;
  navigation: any;
  updateWorkoutHeader: WorkoutActionProps['updateWorkoutHeader'];
}

const WorkoutHeader = ({ route, navigation, updateWorkoutHeader }: Props) => {
  const { genPrograms, workoutHeader } = useSelector((state: ReducerProps) => ({
    genPrograms: state.program.generatedPrograms,
    targetProgram: state.program.targetProgram,
    workoutHeader: state.workout.workoutHeader,
    demoState: state.global.demoState,
  }));

  const [type, setType] = useState<HealthActivity>(
    WorkoutTypes.TraditionalStrengthTraining,
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [programUid, setProgramUid] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState('');
  const [datePicker, setDatePicker] = useState(false);
  const setBanner = useBanner();

  const init = useCallback(() => {
    if (workoutHeader) {
      setType(
        workoutHeader.type
          ? workoutHeader.type
          : WorkoutTypes.TraditionalStrengthTraining,
      );
      setName(workoutHeader.name);
      setDescription(workoutHeader.description);
      setProgramUid(workoutHeader.programUid ? workoutHeader.programUid : '');
      const d = workoutHeader.date
        ? DateTools.UTCISOToLocalDate(workoutHeader.date)
        : new Date();
      setDate(d);
    } else {
      setName('');
      setDescription('');
      setProgramUid('');
    }
  }, [workoutHeader]);

  useEffect(() => {
    init();
  }, [init, route, workoutHeader]);

  const onContinuePress = () => {
    //check values
    if (loading) return;

    if (!name && type === WorkoutTypes.TraditionalStrengthTraining) {
      return setBanner('Name is required.');
    } else if (!type) {
      return setBanner('Type is required.');
    } else if (!date) {
      return setBanner('Date is required.');
    }

    setLoading(true);

    //saving workout
    const workoutHeaderData: WorkoutHeaderProps = {
      name:
        type === WorkoutTypes.TraditionalStrengthTraining
          ? name
            ? name
            : WorkoutTypes.TraditionalStrengthTraining
          : type,
      description,
      programUid,
      date: DateTools.dateToStr(date),
      _id: workoutHeader ? workoutHeader._id : '',
      isPrivate: false,
      type: type,
    };

    updateWorkoutHeader(workoutHeaderData)
      .then(() => {
        setLoading(false);
        navigation.navigate(HomeStackScreens.Workout, {
          goBackScreen: HomeStackScreens.Home,
        });
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const pickerOptions = useMemo(() => {
    switch (picker) {
      case 'type':
        return Object.values(WorkoutTypes).map(type => {
          return {
            label: renderHealthActivityName(type),
            value: type,
          };
        });
      case 'program':
    }

    const generatedPrograms = genPrograms.map(item => ({
      label: capitalize(item.name),
      value: item._id,
    }));

    generatedPrograms.unshift({
      label: 'None',
      value: '',
    });

    return generatedPrograms;
  }, [genPrograms, picker]);

  const getPickerValue = () => {
    switch (picker) {
      case 'type':
        return type;
      case 'program':
        return programUid;
    }

    return '';
  };

  const onPickerChangeValue = (val: string) => {
    switch (picker) {
      case 'type':
        return setType(val as any);
      case 'program':
        return setProgramUid(val);
    }
  };

  const onGoBackHandler = () => {
    const { params } = route;
    params && params.goBackScreen
      ? navigation.navigate(params.goBackScreen)
      : navigation.navigate(HomeStackScreens.Home, {
          directToDash: params && params.directToDash ? true : false,
        });
  };

  return (
    <ScreenTemplate
      enableScrollWrapper
      isBackVisible
      applyContentPadding
      isPickerOpen={picker ? true : false}
      onGoBack={onGoBackHandler}
      rotateBack="-90deg"
      onPickerClose={() => setPicker('')}
      pickerValue={getPickerValue()}
      pickerOptions={pickerOptions}
      onPickerChangeValue={onPickerChangeValue}
      isDatePickerOpen={datePicker}
      datePickerValue={date}
      onDatePickerClose={() => setDatePicker(false)}
      onDatePickerChange={value => setDate(value)}
      middleContent={<PrimaryText size="large">Workout Details</PrimaryText>}>
      <DashboardDemo screen={HomeStackScreens.WorkoutHeader} />
      <FlexBox column>
        <PrimaryText size="small" marginBottom={10}>
          Fill out the form below.
        </PrimaryText>

        <PickerButton
          arrow
          arrowDirection="down"
          borderBottom
          label="Type:"
          onPress={() => setPicker(p => (p ? '' : 'type'))}>
          {renderHealthActivityName(type)}
        </PickerButton>

        {type === WorkoutTypes.TraditionalStrengthTraining && (
          <Input
            label="Name:"
            value={name}
            placeholder="Name"
            autoCapitalize="words"
            onChangeText={txt => setName(txt)}
            maxLength={50}
            mb={15}
          />
        )}
        <Input
          label="Description:"
          value={description}
          placeholder="Description"
          multiline={true}
          onChangeText={txt => setDescription(txt)}
          maxLength={100}
          onSubmitEditing={() => Keyboard.dismiss()}
          blurOnSubmit
          mb={15}
        />

        <PickerButton
          arrow
          arrowDirection="down"
          borderBottom
          label="Date:"
          onPress={() => setDatePicker(p => (p ? false : true))}>
          {date.toDateString()}
        </PickerButton>
        <PrimaryButton
          onPress={onContinuePress}
          marginTop={20}
          loading={loading}>
          Save
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default connect(null, {
  updateWorkoutHeader,
  updateProgramWorkoutHeader,
})(WorkoutHeader);

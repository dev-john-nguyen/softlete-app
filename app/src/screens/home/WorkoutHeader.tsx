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
import useBanner from 'src/hooks/utils/useBanner';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  route: RouteProp<any>;
  navigation: any;
  updateWorkoutHeader: WorkoutActionProps['updateWorkoutHeader'];
}

enum PickerOptions {
  programs = 'programs',
  type = 'type',
}

const WorkoutHeader = ({ route, navigation, updateWorkoutHeader }: Props) => {
  const { genPrograms, workoutHeader } = useSelector((state: ReducerProps) => ({
    genPrograms: state.program.generatedPrograms,
    targetProgram: state.program.targetProgram,
    workoutHeader: state.workout.workoutHeader,
  }));
  const [editable, setEditable] = useState(true);
  const [type, setType] = useState<HealthActivity>(
    WorkoutTypes.TraditionalStrengthTraining,
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [programUid, setProgramUid] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState<PickerOptions>();
  const [datePicker, setDatePicker] = useState(false);
  const setBanner = useBanner();
  const workoutProgram = useMemo(() => {
    if (workoutHeader) {
      return genPrograms.find(p => p._id === workoutHeader.programUid);
    }
  }, [workoutHeader, genPrograms]);

  const init = useCallback(() => {
    if (workoutHeader) {
      setEditable(workoutHeader._id ? false : true);
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
      setEditable(true);
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
      case PickerOptions.type:
        return Object.values(WorkoutTypes).map(type => {
          return {
            label: renderHealthActivityName(type),
            value: type,
          };
        });
      case PickerOptions.programs:
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
      case PickerOptions.type:
        return type;
      case PickerOptions.programs:
        return programUid;
    }

    return '';
  };

  const onPickerChangeValue = (val: string) => {
    switch (picker) {
      case PickerOptions.type:
        return setType(val as any);
      case PickerOptions.programs:
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
      onPickerClose={() => setPicker(undefined)}
      pickerValue={getPickerValue()}
      pickerOptions={pickerOptions}
      onPickerChangeValue={onPickerChangeValue}
      isDatePickerOpen={datePicker}
      datePickerValue={date}
      onDatePickerClose={() => setDatePicker(false)}
      onDatePickerChange={value => setDate(value)}
      headerTitleFormatted="Workout Details"
      rightContent={
        <FlexBox flex={1} justifyContent="flex-end" alignItems="center">
          {workoutHeader?._id && (
            <Icon
              icon="pencil"
              size={20}
              color={Colors.white}
              onPress={() => setEditable(true)}
            />
          )}
        </FlexBox>
      }>
      <FlexBox column>
        <PrimaryText size="small" marginBottom={10}>
          {editable
            ? 'Fill out the form below.'
            : 'Details of your workout can be found below.'}
        </PrimaryText>

        <PickerButton
          disabled={!editable}
          arrow
          arrowDirection="down"
          borderBottom
          label="Type:"
          onPress={() => setPicker(p => (p ? undefined : PickerOptions.type))}>
          {renderHealthActivityName(type)}
        </PickerButton>

        {type === WorkoutTypes.TraditionalStrengthTraining && (
          <Input
            editable={editable}
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
          editable={editable}
          label="Description:"
          value={description}
          placeholder={editable ? 'Description' : ''}
          multiline={true}
          onChangeText={txt => setDescription(txt)}
          maxLength={100}
          onSubmitEditing={() => Keyboard.dismiss()}
          blurOnSubmit
          mb={15}
        />

        <PickerButton
          disabled // disable change right now. Need to configure the ability to dynamically change program -> ticket #70
          arrow
          arrowDirection="down"
          borderBottom
          label="Program:"
          onPress={() =>
            setPicker(p => (p ? undefined : PickerOptions.programs))
          }>
          {workoutProgram?.name ?? 'None'}
        </PickerButton>

        <PickerButton
          disabled={!editable}
          arrow
          arrowDirection="down"
          borderBottom
          label="Date:"
          onPress={() => setDatePicker(p => (p ? false : true))}>
          {date.toDateString()}
        </PickerButton>

        <PrimaryButton
          disabled={!editable}
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

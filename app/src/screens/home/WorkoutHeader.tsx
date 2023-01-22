import React, { useState, useEffect, useCallback } from 'react';
import { FlexBox } from '@app/ui';
import {
  Input,
  PickerButton,
  PrimaryButton,
  PrimaryText,
  ScreenTemplate,
} from '@app/elements';
import { Colors, rgba } from '@app/utils';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard } from 'react-native';
import { ReducerProps } from '../../services';
import {
  RootWorkoutProps,
  WorkoutActionProps,
  WorkoutHeaderProps,
  WorkoutTypes,
} from '../../services/workout/types';
import StyleConstants from '../../components/tools/StyleConstants';
import DateTools from '../../utils/DateTools';
import { capitalize, normalize } from '../../utils/tools';
import {
  RootProgramProps,
  GeneratedProgramProps,
} from '../../services/program/types';
import { updateWorkoutHeader } from '../../services/workout/actions';
import { updateProgramWorkoutHeader } from '../../services/program/actions';
import { HomeStackScreens } from './types';
import { Picker } from '@react-native-picker/picker';
import { HealthActivity } from 'react-native-health';
import { renderHealthActivityName } from '../../utils/format';
import DashboardDemo from '../../components/demo/Demo';
import { DemoStates } from '../../services/global/types';

interface Props {
  genPrograms: GeneratedProgramProps[];
  route: any;
  navigation: any;
  workoutHeader: RootWorkoutProps['workoutHeader'];
  targetProgram: RootProgramProps['targetProgram'];
  updateWorkoutHeader: WorkoutActionProps['updateWorkoutHeader'];
  demoState: DemoStates;
}

//calendar date format yyyy-mm-dd

const WorkoutHeader = ({
  genPrograms,
  route,
  navigation,
  workoutHeader,
  targetProgram,
  updateWorkoutHeader,
}: Props) => {
  const [type, setType] = useState<HealthActivity>(
    WorkoutTypes.TraditionalStrengthTraining,
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [programUid, setProgramUid] = useState('');
  const [date, setDate] = useState(new Date());
  const [error, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState('');
  const [datePicker, setDatePicker] = useState(false);

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
  }, [route, workoutHeader]);

  useEffect(() => {
    init();
  }, [route, workoutHeader]);

  const onContinuePress = () => {
    //check values
    if (loading) return;

    const errors = [];

    if (!name && type === WorkoutTypes.TraditionalStrengthTraining) {
      errors.push('Name required.');
    }

    if (!type) {
      errors.push('type is required.');
    }

    if (!date) {
      errors.push('Date is required.');
    }

    if (errors.length > 0) {
      return setErrors(errors);
    }

    setErrors([]);

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

  const renderActiveProgramName = (_id: string) => {
    const program = genPrograms.find(g => g._id === programUid);
    if (program) return program.name;
  };

  const renderPickerItems = useCallback(() => {
    switch (picker) {
      case 'type':
        return Object.values(WorkoutTypes).map(type => {
          return (
            <Picker.Item
              label={renderHealthActivityName(type)}
              value={type}
              key={type}
            />
          );
        });
      case 'program':
    }

    const generatedPrograms = genPrograms.map(item => (
      <Picker.Item
        label={capitalize(item.name)}
        value={item._id}
        key={item._id}
      />
    ));
    return [
      <Picker.Item label={'None'} value={''} key={'none'} />,
      ...generatedPrograms,
    ];
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
      pickerItems={renderPickerItems()}
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

        {error.length > 0 && (
          <FlexBox marginBottom={10} column>
            {error.map(e => (
              <PrimaryText key={Math.random()} size="small" color={Colors.red}>
                *{e}
              </PrimaryText>
            ))}
          </FlexBox>
        )}

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
          label="Type:"
          onPress={() => setPicker(p => (p ? '' : 'type'))}>
          {renderHealthActivityName(type)}
        </PickerButton>

        {/* <SecondaryText styles={styles.label}>Program</SecondaryText>
                                <Pressable style={styles.programContainer} onPress={() => setPicker(p => p ? '' : 'program')}>
                                    <View style={styles.programSvg}>
                                        <BooksSvg fillColor={Colors.primary} />
                                    </View>
                                    <SecondaryText styles={styles.text}>{renderActiveProgramName(programUid)}</SecondaryText>
                                </Pressable> */}

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
          styles={styles.button}
          loading={loading}>
          Continue
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
  },
  headerText: {
    fontSize: StyleConstants.largeFont,
    color: Colors.lightWhite,
  },
  headerSubText: {
    fontSize: StyleConstants.smallFont,
    color: Colors.lightWhite,
  },
  errorText: {
    fontSize: StyleConstants.smallFont,
    color: Colors.red,
    marginBottom: 2,
  },
  dateInfo: {
    marginTop: StyleConstants.baseMargin,
    marginBottom: StyleConstants.baseMargin,
  },
  label: {
    fontSize: StyleConstants.extraSmallFont,
    color: Colors.lightWhite,
    marginBottom: 10,
    opacity: 0.8,
  },
  date: {
    fontSize: StyleConstants.smallFont,
    color: Colors.black,
    marginLeft: 5,
  },
  button: {
    marginTop: StyleConstants.baseMargin,
    marginBottom: StyleConstants.baseMargin,
  },
  text: {
    fontSize: StyleConstants.smallFont,
    color: Colors.lightWhite,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  programContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: StyleConstants.borderRadius,
    borderWidth: 1,
    borderColor: rgba(Colors.whiteRbg, 0.8),
    marginBottom: StyleConstants.smallMargin,
  },
  programSvg: {
    width: normalize.width(20),
    height: normalize.width(20),
  },
});

const mapStateToProps = (state: ReducerProps) => ({
  genPrograms: state.program.generatedPrograms,
  targetProgram: state.program.targetProgram,
  workoutHeader: state.workout.workoutHeader,
  demoState: state.global.demoState,
});
export default connect(mapStateToProps, {
  updateWorkoutHeader,
  updateProgramWorkoutHeader,
})(WorkoutHeader);

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { Keyboard } from 'react-native';
import { ReducerProps } from '../../services';
import { WorkoutTypes } from '../../types/workouts.types';
import {
  convertDaysToWeekObj,
  convertObjToDays,
  programWorkoutsArrToObj,
} from '../../utils/tools';
import {
  ProgramWorkoutHeaderProps,
  ProgramActionProps,
} from '../../services/program/types';
import { updateProgramWorkoutHeader } from '../../services/program/actions';
import PrimaryText from '../../components/elements/PrimaryText';
import Constants from '../../utils/Constants';
import { HealthActivity } from 'react-native-health';
import { renderHealthActivityName } from '../../utils/format';
import { ProgramStackScreens } from './types';
import { RouteProp } from '@react-navigation/native';
import {
  ScreenTemplate,
  Input,
  PickerButton,
  PrimaryButton,
} from '@app/elements';
import { FlexBox } from '@app/ui';
import useBanner from 'src/hooks/utils/useBanner';

interface Props {
  route: RouteProp<any>;
  navigation: any;
  updateProgramWorkoutHeader: ProgramActionProps['updateProgramWorkoutHeader'];
}

const WorkoutHeader = ({
  route,
  navigation,
  updateProgramWorkoutHeader,
}: Props) => {
  const { targetProgram, workoutHeader } = useSelector(
    (state: ReducerProps) => ({
      targetProgram: state.program.targetProgram,
      workoutHeader: state.program.workoutHeader,
    }),
  );
  const [type, setType] = useState<HealthActivity>(
    WorkoutTypes.TraditionalStrengthTraining,
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState(0);
  const [week, setWeek] = useState(0);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [picker, setPicker] = useState('');
  const setBanner = useBanner();

  useEffect(() => {
    if (workoutHeader) {
      setType(
        workoutHeader.type
          ? workoutHeader.type
          : WorkoutTypes.TraditionalStrengthTraining,
      );
      setName(workoutHeader.name);
      setDescription(workoutHeader.description);
      if (targetProgram && targetProgram.workouts) {
        const obj = programWorkoutsArrToObj(targetProgram.workouts);

        let daysObj = {
          week: 0,
          day: 0,
        };

        if (workoutHeader.daysFromStart) {
          daysObj = convertDaysToWeekObj(workoutHeader.daysFromStart);
        }

        let weekKeys: string[] = [];

        if (!route.params || !route.params.weeks) {
          weekKeys = Object.keys(obj);
          const foundKey = weekKeys.findIndex(
            w => parseInt(w) === daysObj.week,
          );
          if (foundKey < 0) {
            weekKeys.push(daysObj.week.toString());
            weekKeys.sort((a, b) => parseInt(b) - parseInt(a));
          }
        } else {
          weekKeys = route.params.weeks;
        }

        setWeek(daysObj.week);
        setDay(daysObj.day);
        setWeeks(weekKeys);
      }
    } else {
      setName('');
      setDescription('');
    }
  }, [route, targetProgram, workoutHeader]);

  const onContinuePress = () => {
    //check values
    if (loading) return;

    if (!name && type === WorkoutTypes.TraditionalStrengthTraining) {
      return setBanner('Name required!');
    }

    if (!type) {
      return setBanner('Type is required.!');
    }

    setLoading(true);
    //saving program workout

    if (!targetProgram._id) {
      setLoading(false);
      return setBanner(
        "Couldn't find the program id. Please refresh and try again.",
      );
    }

    const programWorkoutHeaderData: ProgramWorkoutHeaderProps = {
      type: type,
      name:
        type === WorkoutTypes.TraditionalStrengthTraining
          ? name
            ? name
            : WorkoutTypes.TraditionalStrengthTraining
          : type,
      description,
      _id: workoutHeader ? workoutHeader._id : '',
      isPrivate: false,
      daysFromStart: convertObjToDays(week, day),
      programTemplateUid: targetProgram._id,
    };

    updateProgramWorkoutHeader(programWorkoutHeaderData)
      .then(() => {
        setLoading(false);
        navigation.navigate(ProgramStackScreens.ProgramWorkout, {
          goBackScreen: ProgramStackScreens.Program,
          isProgram: true,
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
      case 'week':
        return weeks.map((_, i) => {
          return {
            label: (i + 1).toString(),
            value: i,
          };
        });
      case 'day':
      default:
        return new Array(7).fill({}).map((_, i) => {
          return {
            label: Constants.daysOfWeek[i] as string,
            value: i,
          };
        });
    }
  }, [picker, weeks]);

  const getPickerValue = () => {
    switch (picker) {
      case 'type':
        return type;
      case 'week':
        return week.toString();
      case 'day':
        return day.toString();
    }

    return '';
  };

  const onPickerChangeValue = (val: string) => {
    switch (picker) {
      case 'type':
        return setType(val as any);
      case 'week':
        return setWeek(parseInt(val));
      case 'day':
        return setDay(parseInt(val));
    }
  };

  return (
    <ScreenTemplate
      enableScrollWrapper
      isBackVisible
      applyContentPadding
      isPickerOpen={picker ? true : false}
      rotateBack="-90deg"
      onPickerClose={() => setPicker('')}
      pickerValue={getPickerValue()}
      pickerOptions={pickerOptions}
      onPickerChangeValue={onPickerChangeValue}
      middleContent={<PrimaryText size="large">Workout Details</PrimaryText>}>
      <FlexBox column>
        <PrimaryText size="small" marginBottom={10}>
          Fill out the form below.
        </PrimaryText>

        <FlexBox marginBottom={10}>
          <PrimaryText textTransform="capitalize" bold>
            {Constants.daysOfWeek[day]} of week {week + 1}
          </PrimaryText>
        </FlexBox>

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
        <PrimaryButton
          marginTop={20}
          onPress={onContinuePress}
          loading={loading}>
          Save
        </PrimaryButton>
      </FlexBox>
    </ScreenTemplate>
  );
};

export default connect(null, { updateProgramWorkoutHeader })(WorkoutHeader);

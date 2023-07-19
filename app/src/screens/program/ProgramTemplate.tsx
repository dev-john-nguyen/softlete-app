import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import {
  ProgramActionProps,
  ProgramByWeekProps,
  ProgramProps,
} from '../../services/program/types';
import {
  setProgramViewWorkout,
  duplicateProgramWorkout,
  generateProgram,
} from '../../services/program/actions';
import ProgramHeader from '../../components/program/Header';
import ProgramWorkouts from '../../components/program/Workouts';
import { AppDispatch } from '../../../App';
import {
  SET_COPIED_PROGRAM_WORKOUT,
  SET_PROGRAM_WORKOUT_HEADER,
} from '../../services/program/actionTypes';
import { programWorkoutsArrToObj } from '../../utils/tools';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import Loading from '../../components/elements/Loading';
import { ProgramStackScreens } from './types';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors } from '@app/utils';

interface Props {
  navigation: any;
  route: any;
  setProgramViewWorkout: ProgramActionProps['setProgramViewWorkout'];
  duplicateProgramWorkout: ProgramActionProps['duplicateProgramWorkout'];
  dispatch: AppDispatch;
  generateProgram: ProgramActionProps['generateProgram'];
  programProps?: ProgramProps;
}

const ProgramTemplate = ({
  route,
  navigation,
  dispatch,
  setProgramViewWorkout,
  duplicateProgramWorkout,
  generateProgram,
  programProps,
}: Props) => {
  const [workoutsObj, setWorkoutsObj] = useState<ProgramByWeekProps>({});
  const mount = useRef(false);

  const updateProgram = useCallback(() => {
    if (programProps) {
      if (programProps.workouts && programProps.workouts.length > 0) {
        setWorkoutsObj(programWorkoutsArrToObj(programProps.workouts));
      } else {
        setWorkoutsObj({});
      }
    }
  }, [programProps]);

  useEffect(() => {
    mount.current = true;
    updateProgram();
    return () => {
      mount.current = false;
    };
  }, [programProps, updateProgram]);

  const disableEdit = () =>
    route.params && route.params.softlete ? true : false;

  const navToAddWorkout = (daysFromStart: number, weeks: string[]) => {
    dispatch({
      type: SET_PROGRAM_WORKOUT_HEADER,
      payload: {
        program: true,
        daysFromStart,
      },
    });
    navigation.navigate(ProgramStackScreens.ProgramWorkoutHeader, {
      weeks: weeks,
    });
  };

  const navToViewWorkout = (workoutUid: string) => {
    //fetch the exercises before navigating to viewWorkout
    if (!workoutUid || !programProps) return;
    setProgramViewWorkout(workoutUid, programProps._id)
      .then(() => {
        navigation.navigate(ProgramStackScreens.ProgramWorkout, {
          softlete: disableEdit(),
        });
      })
      .catch(err => console.log(err));
  };

  const onCopyWorkout = (workoutUid: string) => {
    if (disableEdit()) return;
    dispatch({
      type: SET_COPIED_PROGRAM_WORKOUT,
      payload: workoutUid,
    });
  };

  const onPasteWorkout = (daysFromStart: number) => {
    if (disableEdit()) return;
    duplicateProgramWorkout(daysFromStart).catch(err => {
      console.log(err);
    });
  };

  const onDownload = () =>
    navigation.navigate(ProgramStackScreens.ProgramDownload);

  const likeCount = () =>
    programProps && programProps.likeUids ? programProps.likeUids.length : 0;

  if (!programProps) return <Loading />;

  return (
    <ScreenTemplate
      isBackVisible
      applyContentPadding
      onGoBack={() => navigation.goBack()}
      headerTitleFormatted={programProps.name}
      rightContent={
        <FlexBox alignItems="center" justifyContent="flex-end" flex={1}>
          <Icon
            icon="ellipsis"
            size={20}
            color={Colors.white}
            onPress={() =>
              navigation.navigate(ProgramStackScreens.ProgramModal)
            }
            hitSlop={5}
          />
        </FlexBox>
      }>
      <FlexBox height="40%" marginTop={5}>
        <ProgramHeaderImage
          uri={programProps.imageUri}
          container={{ borderRadius: 0 }}
        />
      </FlexBox>
      <FlexBox column flex={1} marginTop={10} marginBottom={15}>
        <ProgramHeader
          name={programProps.name}
          description={programProps.description}
        />
        <ProgramWorkouts
          workoutsObj={workoutsObj}
          setWorkoutsObj={setWorkoutsObj}
          onAddWorkout={navToAddWorkout}
          navToViewWorkout={navToViewWorkout}
          onCopyWorkout={onCopyWorkout}
          onPasteWorkout={onPasteWorkout}
          athlete={disableEdit()}
        />
      </FlexBox>
    </ScreenTemplate>
  );
};

const mapStateToProps = (state: ReducerProps) => ({
  programProps: state.program.targetProgram,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setProgramViewWorkout: (workoutUid: string, programUid: string) =>
      dispatch(setProgramViewWorkout(workoutUid, programUid)),
    duplicateProgramWorkout: (daysFromStart: number) =>
      dispatch(duplicateProgramWorkout(daysFromStart)),
    generateProgram: (programUid: string, startDate: string) =>
      dispatch(generateProgram(programUid, startDate)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgramTemplate);

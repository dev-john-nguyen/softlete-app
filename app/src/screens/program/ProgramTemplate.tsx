import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {ReducerProps} from '../../services';
import {connect} from 'react-redux';
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
import BaseColors, {rgba} from '../../utils/BaseColors';
import ProgramWorkouts from '../../components/program/Workouts';
import {AppDispatch} from '../../../App';
import StyleConstants from '../../components/tools/StyleConstants';
import {
  SET_COPIED_PROGRAM_WORKOUT,
  SET_PROGRAM_WORKOUT_HEADER,
} from '../../services/program/actionTypes';
import {programWorkoutsArrToObj, normalize} from '../../utils/tools';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import PencilSvg from '../../assets/PencilSvg';
import Loading from '../../components/elements/Loading';
import {ProgramStackScreens} from './types';
import Chevron from '../../assets/ChevronSvg';
import ProgramDownload from '../../components/program/Download';
import ScreenTemplate from '../../components/elements/ScreenTemplate';

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
  }, [programProps]);

  const disableEdit = () =>
    route.params && route.params.softlete ? true : false;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !disableEdit() ? (
          <Pressable
            style={styles.editContainer}
            onPress={() =>
              navigation.navigate(ProgramStackScreens.ProgramModal)
            }>
            <View style={styles.edit}>
              <PencilSvg fillColor={BaseColors.primary} />
            </View>
          </Pressable>
        ) : (
          <></>
        ),
      headerLeft: () => (
        <Pressable
          style={styles.editContainer}
          onPress={() => navigation.goBack()}>
          <View style={styles.edit}>
            <Chevron strokeColor={BaseColors.primary} />
          </View>
        </Pressable>
      ),
    });
  }, [programProps]);

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
    <ScreenTemplate>
      <View style={{height: '40%'}}>
        <ProgramHeaderImage
          uri={programProps.imageUri}
          container={{borderRadius: 0}}
        />
        {/* <ProgramLike
                    likeCount={likeCount()}
                    isLiked={false}
                /> */}
        <ProgramDownload onDownload={onDownload} />
      </View>
      <View style={styles.container}>
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
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: StyleConstants.smallMediumFont,
    color: BaseColors.primary,
  },
  container: {
    flex: 1,
    marginTop: StyleConstants.baseMargin,
    marginBottom: StyleConstants.baseMargin,
  },
  editContainer: {
    marginRight: StyleConstants.baseMargin,
    marginLeft: StyleConstants.baseMargin,
    backgroundColor: rgba(BaseColors.whiteRbg, 0.8),
    padding: 10,
    borderRadius: 100,
  },
  edit: {
    width: normalize.width(25),
    height: normalize.width(25),
  },
});

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

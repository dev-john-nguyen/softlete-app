import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useContext,
  useMemo,
} from 'react';
import {
  WorkoutExerciseProps,
  WorkoutExerciseDataProps,
  DataArrProps,
  WorkoutStatus,
} from '../../services/workout/types';
import WorkoutNavbar from './Navbar';
import ExercisesContainer from './exercises/Container';
import _ from 'lodash';
import Constants from '../../utils/Constants';
import { useDispatch } from 'react-redux';
import {
  removeWorkoutExercise,
  updateWorkoutExerciseData,
} from '../../services/workout/actions';
import { WorkoutContext } from '@app/contexts';
import { useNavigation } from '@react-navigation/native';
import { FlexBox } from '@app/ui';
import {
  removeProgramWorkoutExercise,
  updateProgramExerciseData,
} from 'src/services/program/actions';
import { useScreenTemplateState } from '@app/elements';
import AddExercise from './components/AddExercise';

const WorkoutContainer = () => {
  const {
    onNavigateToAddExercise,
    onNavigateToExercise,
    isProgram,
    athlete,
    workout,
  } = useContext(WorkoutContext);
  const { setMiddleContent } = useScreenTemplateState();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [groupKeys, setGroupKeys] = useState<number[]>([]);
  const [groupState, setGroupState] = useState({
    prev: 0,
    cur: 0,
  });
  const [navGroupState, setNavGroupState] = useState({ group: 0 });
  const [exercises, setExercises] = useState<WorkoutExerciseProps[]>([]);
  const [curEx, setCurEx] = useState<WorkoutExerciseProps>();
  const navIsActive = useRef(false);
  const mount = useRef(false);
  const saving = useRef(false);
  const statusRef = useRef('');
  const exercisePropsRef: any = useRef([]);
  const prevWorkoutRefId = useRef<string>('');
  const autoSaveHandler = useRef(
    _.debounce(() => {
      saveExercisesDataHandler();
    }, Constants.autoSaveDuration),
  );

  const handleUpdateWorkoutStates = useCallback(() => {
    if (!workout.exercises) return;
    let cloneExs = _(workout.exercises).cloneDeep();
    cloneExs = _.sortBy(cloneExs, e => [e.group, e.order]);
    let groupCount = 0;
    let prevGroup = 0;

    cloneExs.forEach((e, i) => {
      if (i === 0) {
        prevGroup = e.group;
        e.group = groupCount;
      } else {
        if (prevGroup !== e.group) {
          groupCount++;
        }
        prevGroup = e.group;
        e.group = groupCount;
      }
    });

    const keys = _.sortedUniq(_.sortBy(cloneExs.map(e => e.group)));

    setExercises(cloneExs);
    setGroupKeys(keys);
  }, [workout]);

  useLayoutEffect(() => {
    setMiddleContent(
      <WorkoutNavbar
        status={workout.status}
        groupKeys={groupKeys}
        onGroupPress={key => setNavGroupState({ group: key })}
        curGroup={groupState.cur}
        onAddExercise={onAddExercise}
        athlete={athlete}
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [athlete, workout, groupKeys, groupState]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      // Prevent default navigation behavior
      e.preventDefault();
      // Save data before leaving
      saveExercisesDataHandler();
      autoSaveHandler.current.cancel();
      // Then navigate to the next screen
      navigation.dispatch(e.data.action);
    });
    mount.current = true;
    return () => {
      mount.current = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleUpdateWorkoutStates();
    exercisePropsRef.current = workout.exercises;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.exercises]);

  useEffect(() => {
    saveExercisesDataHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.status]);

  useEffect(() => {
    if (mount.current) autoSaveHandler.current();
  }, [exercises, athlete]);

  useEffect(() => {
    prevWorkoutRefId.current = workout._id;

    if (statusRef.current !== workout.status) {
      statusRef.current = workout.status;
      navIsActive.current = true;
      setGroupState({
        prev: 0,
        cur: 0,
      });
      setNavGroupState({ group: 0 });
    }
  }, [workout]);

  const saveExercisesDataHandler = async () => {
    if (athlete || saving.current || prevWorkoutRefId.current !== workout._id) {
      return;
    }

    const exercises: WorkoutExerciseProps[] = await (async () =>
      new Promise(resolve => {
        setExercises(e => {
          resolve(e);
          return e;
        });
      }))();

    saving.current = true;

    const stateData = exercises.map(e => {
      return {
        _id: e._id,
        tempId: e.tempId,
        calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
        data: e.data.map(d => ({
          ...d,
          predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
          performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
        })),
      };
    });

    const refData = exercisePropsRef.current?.map((e: WorkoutExerciseProps) => {
      return {
        _id: e._id,
        tempId: e.tempId,
        calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
        data: e.data.map(d => ({
          ...d,
          predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
          performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
        })),
      };
    });

    const changes = _.differenceWith(stateData, refData, _.isEqual);

    if (changes.length < 1) {
      saving.current = false;
      return;
    }

    const dataArr: DataArrProps[] = changes
      .filter(e => e._id || e.tempId)
      .map(e => ({
        _id: e._id ? e._id : '',
        tempId: e.tempId,
        calcRef: e.calcRef ? parseFloat(e.calcRef.toString()) : 0,
        data: e.data.map(d => ({
          ...d,
          predictVal: d.predictVal ? parseFloat(d.predictVal.toString()) : 0,
          performVal: d.performVal ? parseFloat(d.performVal.toString()) : 0,
        })),
      }));

    let res: any;

    if (dataArr.length > 0) {
      if (isProgram) {
        // save to program
        res = dispatch(updateProgramExerciseData(dataArr));
      } else {
        // save to real workout
        res = dispatch(updateWorkoutExerciseData(dataArr));
      }
    }

    saving.current = false;
    return res;
  };

  const onGroupSelect = (g: number) => {
    navIsActive.current = true;
    setGroupState(s => ({
      prev: s.cur,
      cur: g,
    }));
  };

  const onUpdateData = (
    updatedData: WorkoutExerciseDataProps[],
    index: number,
  ) => {
    if (athlete) return;
    exercises[index].data = [...updatedData];
    setExercises([...exercises]);
  };

  const onCalcRefUpdate = (calc: number | string, index: number) => {
    if (athlete) return;
    exercises[index].calcRef = calc as number; //but this is actually a string;
    exercises[index].data = exercises[index].data.map(d => {
      //take percentage and multiply by calc ref to get predicted val
      let predictVal = 0;
      if (d.pct) {
        const val = (d.pct / 100) * parseFloat(calc as string);
        predictVal = parseFloat(val.toFixed(2));
      }
      return {
        ...d,
        predictVal: predictVal ? predictVal : 0,
      };
    });
    setExercises([...exercises]);
  };

  const onAddExercise = (newGroup?: boolean) => {
    if (
      workout.status === WorkoutStatus.completed ||
      athlete ||
      !onNavigateToAddExercise
    )
      return;

    let groupProps = 0;

    let keys: number[] = [];

    setGroupKeys(k => {
      keys = k;
      return k;
    });

    if (newGroup) {
      if (keys.length < 1) {
        groupProps = 0;
      } else {
        //get the last group and plus one
        groupProps = keys[keys.length - 1] + 1;
      }
    } else {
      groupProps = groupState.cur;
    }
    const order = newGroup ? 0 : exercises ? exercises.length - 1 : 0;
    // save exercise data if there are any changes
    saveExercisesDataHandler();
    onNavigateToAddExercise(groupProps, order);
  };

  const onRemoveExercise = async (exercise: WorkoutExerciseProps) => {
    if (isProgram) {
      dispatch(removeProgramWorkoutExercise(exercise));
    } else {
      dispatch(removeWorkoutExercise(exercise));
    }
  };

  const shouldAddCom = useMemo(() => {
    if (athlete) return false;
    if (workout.status !== WorkoutStatus.completed) return true;
    if (workout.programTemplateUid) return true;
    return false;
  }, [athlete, workout]);

  return (
    <FlexBox flex={1} zIndex={100} justifyContent="center">
      <ExercisesContainer
        exercises={exercises}
        onUpdateData={onUpdateData}
        curGroup={groupState.cur}
        onGroupSelect={onGroupSelect}
        navIsActive={navIsActive}
        setCurEx={setCurEx}
        onNavigateToExercise={onNavigateToExercise}
        onCalcRefUpdate={onCalcRefUpdate}
        removeWorkoutExercise={onRemoveExercise}
        navGroupState={navGroupState}
      />
      {shouldAddCom && <AddExercise onAddExercise={onAddExercise} />}
    </FlexBox>
  );
};

export default WorkoutContainer;

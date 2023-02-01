import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useContext,
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
import { useDispatch, useSelector } from 'react-redux';
import {
  removeWorkoutExercise,
  updateWorkoutExerciseData,
} from '../../services/workout/actions';
import {
  removeProgramWorkoutExercise,
  updateProgramExerciseData,
} from '../../services/program/actions';
import { ImageProps } from '../../services/user/types';
import { HomeWorkoutContext } from '@app/contexts';
import { useNavigation } from '@react-navigation/native';
import { FlexBox } from '@app/ui';
import { ReducerProps } from 'src/services';
import { CircleAdd } from '@app/elements';

interface Props {
  isProgramTemplate?: boolean;
  onNavigateToAddExercise?: (group: number, order: number) => void;
  athlete?: boolean;
  image?: ImageProps;
  setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}

const WorkoutContainer = ({ isProgramTemplate, athlete }: Props) => {
  const { onNavigateToAddExercise, onNavigateToExercise, setImage, image } =
    useContext(HomeWorkoutContext);
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
  }));
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
  }, [workout.exercises]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <WorkoutNavbar
          status={workout.status}
          groupKeys={groupKeys}
          onGroupPress={key => setNavGroupState({ group: key })}
          curGroup={groupState.cur}
          onAddExercise={onAddExercise}
          athlete={athlete}
        />
      ),
    });
  }, [athlete, workout, groupKeys, groupState]);

  useEffect(() => {
    handleUpdateWorkoutStates();
    exercisePropsRef.current = workout.exercises;
  }, [workout.exercises]);

  useEffect(() => {
    mount.current = true;

    const saveInterval = setInterval(() => {
      saveExercisesData();
    }, Constants.autoSaveDuration);

    return () => {
      mount.current = false;
      clearInterval(saveInterval);
      saveExercisesData();
    };
  }, []);

  useEffect(() => {
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

  const saveExercisesData = async () => {
    if (athlete || saving.current) return;
    saving.current = true;

    let stateExercises: WorkoutExerciseProps[] = [];
    //need to get the most up to date state of exercises
    setExercises(e => {
      stateExercises = [...e];
      return e;
    });

    const stateData = stateExercises.map(e => {
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
      if (isProgramTemplate) {
        //save to program
        res = await dispatch(updateProgramExerciseData(dataArr)).catch(err =>
          console.log(err),
        );
      } else {
        //save to real workout
        res = await dispatch(updateWorkoutExerciseData(dataArr)).catch(err =>
          console.log(err),
        );
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
    //save exercise data if there are any changes
    saveExercisesData();
    onNavigateToAddExercise(groupProps, order);
  };

  const onRemoveExercise = async (exercise: WorkoutExerciseProps) => {
    if (isProgramTemplate) {
      await dispatch(removeProgramWorkoutExercise(exercise));
    } else {
      await dispatch(removeWorkoutExercise(exercise));
    }
  };

  const shouldAddCom = (() => {
    if (athlete) return false;
    if (workout.status === WorkoutStatus.pending) return true;
    if (workout.programTemplateUid) return true;
    return false;
  })();

  return (
    <FlexBox flex={1} zIndex={100} justifyContent="center">
      <ExercisesContainer
        exercises={exercises}
        onUpdateData={onUpdateData}
        curGroup={groupState.cur}
        onGroupSelect={onGroupSelect}
        navIsActive={navIsActive}
        workout={workout}
        setCurEx={setCurEx}
        onNavigateToExercise={onNavigateToExercise}
        onCalcRefUpdate={onCalcRefUpdate}
        athlete={athlete}
        removeWorkoutExercise={onRemoveExercise}
        navGroupState={navGroupState}
        image={image}
        setImage={setImage}
      />
      {shouldAddCom && (
        <CircleAdd onPress={onAddExercise} style={{ bottom: 10 }} />
      )}
    </FlexBox>
  );
};

export default WorkoutContainer;

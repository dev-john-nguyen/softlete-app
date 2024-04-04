import React, { useState, useEffect, useCallback } from 'react';
import {
  WorkoutExerciseProps,
  WorkoutExercisesObjProps,
} from '../../types/workouts.types';
import ExerciseList from '../../components/restructure/List';
import { useSharedValue } from 'react-native-reanimated';
import { listToObject } from '../../components/restructure/utils';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerProps, ThunkAppDispatch } from '../../services';
import { exercisesArrToObj } from '../../utils/tools';
import { ActivityIndicator } from 'react-native';
import { updateWorkoutExercises } from '../../services/workout/actions';
import _ from 'lodash';
import { BannerTypes } from '../../services/banner/types';
import PrimaryText from '../../components/elements/PrimaryText';
import { ScreenTemplate } from '@app/elements';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors } from '@app/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import useBanner from 'src/hooks/utils/useBanner';
import { updateProgramWorkoutExercises } from 'src/services/program/actions';
import { ProgramStackScreens } from '../program/types';

const ExerciseRestructure = () => {
  const route = useRoute();
  const isProgram =
    route.name === ProgramStackScreens.ProgramReorderWorkoutExercises;
  const [exercises, setExercises] = useState<WorkoutExerciseProps[]>([]);
  const [exercisesObj, setExerciseObj] = useState<WorkoutExercisesObjProps>({});
  const [groups, setGroups] = useState<string[]>([]);
  const [curGroup, setCurGroup] = useState<string>('');
  const exercisePos = useSharedValue<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [trashBin, setTrashBin] = useState<WorkoutExerciseProps[]>([]);
  const [prevExerciseObj, setPrevExerciseObj] =
    useState<WorkoutExercisesObjProps>({});
  const { workout } = useSelector((state: ReducerProps) => ({
    workout: isProgram ? state.program.viewWorkout : state.workout.viewWorkout,
  }));
  const navigation = useNavigation();
  const setBanner = useBanner();
  const dispatch = useDispatch<ThunkAppDispatch>();

  const initiateData = useCallback(() => {
    if (workout) {
      if (!workout.exercises || workout.exercises.length < 1) {
        setBanner(
          "Workout doesn't contain any exercises.",
          BannerTypes.warning,
        );
        navigation.goBack();
        return;
      }

      //need to initiate exercseObj
      const WoExObj = _.cloneDeep(exercisesArrToObj(workout.exercises));

      const keys = Object.keys(WoExObj).sort(
        (a, b) => parseInt(a) - parseInt(b),
      );

      //add additional one
      const lastKey = keys[keys.length - 1];
      const newKey = parseInt(lastKey) + 1;
      WoExObj[newKey.toString()] = [];

      setGroups([...keys, newKey.toString()]);
      setCurGroup(keys[0]);

      const curEx = [...WoExObj[keys[0]]].sort((a, b) => a.order - b.order);
      exercisePos.value = listToObject(curEx);
      setExerciseObj(WoExObj);
      setPrevExerciseObj(_.cloneDeep(WoExObj));
    }
  }, [workout]);

  useEffect(() => {
    initiateData();
  }, [workout]);

  const handleUpdateExerciseState = useCallback(() => {
    const curExercises = exercisesObj[curGroup];
    if (!curExercises) {
      setExercises([]);
      return;
    }
    exercisePos.value = listToObject([...curExercises]);
    setExercises([...curExercises]);
  }, [curGroup, exercisesObj]);

  useEffect(() => {
    if (curGroup) handleUpdateExerciseState();
  }, [curGroup, exercisesObj]);

  const onSave = () => {
    if (loading) return;

    setLoading(true);
    //update the current order of the exercises
    exercisesObj[curGroup] = handleExerciseReorder(exercisesObj[curGroup]);

    if (_.isEqual(prevExerciseObj, exercisesObj)) {
      setBanner('No changes were made.', BannerTypes.warning);
      setLoading(false);
      return;
    }

    //prepare exercises
    const saveExercises: WorkoutExerciseProps[] = [];

    Object.keys(exercisesObj).forEach(k => {
      exercisesObj[k].forEach(e => {
        saveExercises.push(e);
      });
    });

    const removedExercises: WorkoutExerciseProps[] = [];

    if (trashBin.length > 0) {
      trashBin.forEach(t => {
        removedExercises.push({
          ...t,
          remove: true,
        });
      });
    }

    if (saveExercises.length < 1 && removedExercises.length < 1) {
      return setLoading(false);
    }

    dispatch(
      isProgram
        ? updateProgramWorkoutExercises(
            workout._id,
            saveExercises,
            removedExercises,
          )
        : updateWorkoutExercises(workout._id, saveExercises, removedExercises),
    )
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const onExerciseToGroup = (exerciseUid: string, targetGroup: string) => {
    const objExIndex = exercisesObj[curGroup].findIndex(
      e => e._id === exerciseUid,
    );
    if (objExIndex < 0) return;
    //remove and change group
    //need to update the group
    if (exercisesObj[targetGroup]) {
      exercisesObj[targetGroup].push(exercisesObj[curGroup][objExIndex]);
    } else {
      exercisesObj[targetGroup] = [exercisesObj[curGroup][objExIndex]];
    }

    exercisesObj[curGroup].splice(objExIndex, 1);
    regenerateExerciseObj();
  };

  const regenerateExerciseObj = () => {
    const newObj: WorkoutExercisesObjProps = {};

    let count = 0;

    Object.keys(exercisesObj)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach(key => {
        const groupExs = exercisesObj[key];
        if (groupExs.length > 0) {
          newObj[count] = groupExs.map(e => ({ ...e, group: count }));
          count++;
        }
      });

    const newGroups = Object.keys(newObj).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );
    const lastGroup = newGroups[newGroups.length - 1];
    const newGroup = parseInt(lastGroup) + 1;
    newObj[newGroup] = [];
    setGroups([...newGroups, newGroup.toString()]);
    setExerciseObj({ ...newObj });
  };

  const onRemove = (id: string) => {
    const foundIndex = exercises.findIndex(
      ex => ex._id === id || ex.tempId === id,
    );
    if (foundIndex < 0) return;
    const remove = exercises[foundIndex].remove;
    exercises[foundIndex].remove = remove ? false : true;
    setExercises([...exercises]);
  };

  const handleExerciseReorder = (exs: WorkoutExerciseProps[]) => {
    if (!exs || exs.length < 1) return [];

    for (let i = 0; i < exs.length; i++) {
      const { _id } = exs[i];
      if (_id && exercisePos.value[_id] != null) {
        exs[i] = {
          ...exs[i],
          group: parseInt(curGroup),
          order: exercisePos.value[_id],
        };
      }
    }

    exs.sort((a, b) => a.order - b.order);
    return [...exs];
  };

  const onChangeGroup = (nextGroup: string) => {
    //this is not getting the most up to date exerciseObj because list header doesn't rerender when exerciseObj rerenders
    //must use setExerciseObj to get most recent obj
    if (nextGroup === curGroup) return;

    setExerciseObj(obj => {
      if (obj[curGroup]) {
        obj[curGroup] = handleExerciseReorder(obj[curGroup]);
        setExerciseObj({ ...obj });
      }
      return { ...obj };
    });

    setCurGroup(nextGroup);
  };

  const onTrashExercise = (exerciseUid: string) => {
    //current group
    const exerciseIndex = exercisesObj[curGroup].findIndex(
      e => e._id === exerciseUid,
    );
    if (exerciseIndex > -1) {
      setTrashBin(s => [...s, exercisesObj[curGroup][exerciseIndex]]);
      exercisesObj[curGroup].splice(exerciseIndex, 1);
    }
    regenerateExerciseObj();
  };

  return (
    <ScreenTemplate
      isBackVisible
      middleContent={
        <FlexBox alignItems="flex-end">
          <PrimaryText size="medium">Restructure</PrimaryText>
        </FlexBox>
      }
      rightContent={
        <FlexBox alignItems="flex-end" justifyContent="flex-end" flex={1}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Icon icon="save" color={Colors.white} size={25} onPress={onSave} />
          )}
        </FlexBox>
      }>
      <ExerciseList
        exercisesProps={exercises}
        groupsProps={groups}
        onSave={onSave}
        onRemove={onRemove}
        curGroup={curGroup}
        onChangeGroup={onChangeGroup}
        onExerciseToGroup={onExerciseToGroup}
        exercisePos={exercisePos}
        onTrashExercise={onTrashExercise}
      />
    </ScreenTemplate>
  );
};

export default ExerciseRestructure;

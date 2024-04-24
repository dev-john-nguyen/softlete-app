import { FC, useMemo } from 'react';
import ExerciseGroupIcon from '../../ExerciseGroupIcon';
import { FlexBox } from '@app/ui';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useExerciseGroupParams } from 'src/screens/home/workout/hooks/strength.hook';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { Colors, rgba } from '@app/utils';
import { useDispatch } from 'react-redux';
import { ThunkAppDispatch } from 'src/services';
import { MoveExercisePayload, moveExercise } from '@app/services';
import { WorkoutExerciseProps } from '@app/types';

type Props = {
  onClose: () => void;
  letterIndex: number;
  exercise: WorkoutExerciseProps;
};

const ExerciseMoveMenu: FC<Props> = ({ onClose, letterIndex, exercise }) => {
  const { groupParams } = useExerciseGroupParams();
  const dispatch = useDispatch<ThunkAppDispatch>();

  const addOneToGroupLetterIndexes = useMemo(() => {
    const groupLetterIndexes = [...groupParams.keys()];
    if (!groupLetterIndexes.length) {
      return [0];
    }
    const max = Math.max(...groupLetterIndexes);
    return [...groupLetterIndexes.filter(i => i !== letterIndex), max + 1];
  }, [groupParams, letterIndex]);

  const onMoveExerciseToGroup = (groupIndex: number) => {
    const groupProps = groupParams.get(groupIndex);
    if (!groupProps) return;
    const payload: MoveExercisePayload = {
      exerciseId: exercise._id as string,
      groupIndex: groupProps.groupIndex,
      order: groupProps.totalExercises,
    };
    dispatch(moveExercise(payload));
  };

  const renderItemHandler = (props: ListRenderItemInfo<number>) => {
    return (
      <ExerciseGroupIcon
        letterIndex={props.item}
        onPress={() => onMoveExerciseToGroup(props.item)}
        customSizes={{
          container: 40,
          fontSize: 23,
          iconSize: 30,
        }}
      />
    );
  };

  return (
    <FlexBox
      width="100%"
      padding={8}
      alignItems="center"
      gap={10}
      backgroundColor={rgba(Colors.whiteRbg, 0.05)}
      borderRadius={100}>
      <FlexBox width={5} />
      <FontAwesome6Icon
        name="x"
        color={Colors.white}
        size={15}
        onPress={onClose}
      />
      <FlexBox flex={1} marginLeft={15}>
        <FlatList
          horizontal
          renderItem={renderItemHandler}
          data={addOneToGroupLetterIndexes}
          contentContainerStyle={{ gap: 10 }}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default ExerciseMoveMenu;

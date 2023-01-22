import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, } from 'react-native';
import { HEIGHT } from './utils';
import MoveableItem from './Moveable';
import { WorkoutExerciseProps } from '../../services/workout/types';
import PrimaryText from '../elements/PrimaryText';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import ReorderHeader from './Header';
import { GroupPosProps, PositionProps } from './types';
import StyleConstants from '../tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';

interface Props {
    exercisesProps: WorkoutExerciseProps[];
    groupsProps: string[];
    curGroup: string;
    onSave: () => void;
    onRemove: (id: string) => void;
    onChangeGroup: (g: string) => void;
    onExerciseToGroup: (exerciseUid: string, group: string) => void;
    exercisePos: Animated.SharedValue<{
        [id: string]: number;
    }>;
    onTrashExercise: (id: string) => void;
}

const RestructureList = ({ exercisesProps, groupsProps, curGroup, onSave, onRemove, onChangeGroup, onExerciseToGroup, exercisePos, onTrashExercise }: Props) => {
    const [list, setList] = useState<WorkoutExerciseProps[]>([]);
    const scrollViewRef: any = useAnimatedRef();
    const scrollY = useSharedValue(0);
    const headerPos = useSharedValue({
        x: 0,
        y: 0
    });
    const [groupsPos, setGroupsPos] = useState<GroupPosProps>({});
    const [overflow, setOverflow] = useState(false);
    const [trashPos, setTrashPos] = useState<PositionProps>({
        x: 0,
        y: 0,
        height: 0,
        width: 0
    });

    useEffect(() => {
        //I need this because the positions value passed from props won't reflect the changes of exerciseProps 
        setList(exercisesProps)
    }, [exercisesProps])

    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const renderScrollComponents = () => {

        if (list.length < 1) return;

        return (
            list.map(exercise => (
                <MoveableItem
                    key={exercise._id as string}
                    id={exercise._id as string}
                    exercise={exercise}
                    exercisePos={exercisePos}
                    itemsCount={exercisesProps.length}
                    scrollY={scrollY}
                    onRemove={onRemove}
                    headerPos={headerPos}
                    groupsPos={groupsPos}
                    onExerciseToGroup={onExerciseToGroup}
                    curGroup={curGroup}
                    setOverflow={setOverflow}
                    onTrashExercise={onTrashExercise}
                    trashPos={trashPos}
                />
            ))
        )
    }

    return (
        <View style={styles.container}>
            <ReorderHeader
                curGroup={curGroup}
                onChangeGroup={onChangeGroup}
                groupsProps={groupsProps}
                headerPos={headerPos}
                setGroupsPos={setGroupsPos}
                setTrashPos={setTrashPos}
            />
            <Animated.ScrollView
                style={{
                    height: '90%',
                    overflow: 'visible'
                }}
                contentContainerStyle={{
                    height: list.length > 0 ? (list.length * HEIGHT) : '100%',
                }}
                ref={scrollViewRef}
                scrollEventThrottle={16}
                onScroll={handleScroll}
            >
                {renderScrollComponents()}
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary
    }
})
export default RestructureList;
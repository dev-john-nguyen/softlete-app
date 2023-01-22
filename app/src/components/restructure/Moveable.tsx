import React, { useState, useEffect, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, runOnJS, withTiming, useAnimatedReaction } from 'react-native-reanimated';
import Item from './Item';
import { PanGestureHandler, GestureEventPayload, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { HEIGHT, objectMove, clamp, findOverlapGroup } from './utils';
import { WorkoutExerciseProps } from '../../services/workout/types';
import BaseColors from '../../utils/BaseColors';
import { GroupPosProps, PositionProps } from './types';
import { normalize } from '../../utils/tools';


interface Props {
    exercise: WorkoutExerciseProps;
    id: string;
    exercisePos: Animated.SharedValue<{
        [id: string]: number;
    }>;
    itemsCount: number;
    scrollY: Animated.SharedValue<any>;
    onRemove: (id: string) => void;
    groupsPos: GroupPosProps;
    onExerciseToGroup: (exerciseUid: string, group: string) => void;
    curGroup: string;
    setOverflow: React.Dispatch<React.SetStateAction<boolean>>;
    headerPos: Animated.SharedValue<{
        x: number;
        y: number;
    }>
    trashPos: PositionProps;
    onTrashExercise: (id: string) => void;
}

const arePropsEqual = (prevProps: Props, nextProps: Props) => {
    return (
        prevProps.exercise === nextProps.exercise
        && prevProps.id === nextProps.id
        && prevProps.itemsCount === nextProps.itemsCount
        && prevProps.groupsPos === nextProps.groupsPos
        && prevProps.trashPos === nextProps.trashPos
    )
}

const leftStart = 0;


const RestructureMoveable = React.memo(({ exercise, exercisePos, id, itemsCount, scrollY, onRemove, headerPos, groupsPos, onExerciseToGroup, curGroup, setOverflow, trashPos, onTrashExercise }: Props) => {
    const [moving, setMoving] = useState(false);
    const [movingGroup, setMovingGroup] = useState<string>('');
    const top = useSharedValue(exercisePos.value[id] * HEIGHT);
    const left = useSharedValue(leftStart);
    const width = useSharedValue(90);
    const radius = useSharedValue(0);
    const mount = useRef(false);

    //When the object list gets updated, this useAnimatedReaction gets called
    //it will animated to the new position which is calculated by current index position times height
    useAnimatedReaction(
        () => exercisePos.value[id],
        (currentPosition, previousPosition) => {
            if (currentPosition !== previousPosition) {
                if (!moving) {
                    top.value = withSpring((currentPosition) * HEIGHT);
                    radius.value = withTiming(0);
                    left.value = withTiming(leftStart);
                }
            }
        },
        [moving]
    );

    useEffect(() => {
        mount.current = true
        return () => {
            mount.current = false
        }
    }, [])

    const onMovingGroup = (binName: string) => {
        if (mount.current) {
            setMovingGroup(binName)
        }
    }

    const onMoving = (move: boolean) => {
        if (mount.current) {
            setMoving(move)
        }
    }

    const onOverflow = (overflow: boolean) => {
        if (mount.current) {
            setOverflow(overflow)
        }
    }

    const onGestureActive = (event: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>) => {
        'worklet';
        const { absoluteY, absoluteX } = event;

        //check if the item is in the header
        if (absoluteY < (headerPos.value.y) && scrollY.value <= 20) {
            //change width and radius for style
            if (width.value !== 20) {
                width.value = withTiming(20)
                radius.value = withTiming(100)
            }
            //allow to move horizontally
            left.value = absoluteX;
            //check if it is overlapping a group
            runOnJS(onMovingGroup)(findOverlapGroup(groupsPos, trashPos, absoluteX, headerPos.value.x))
        } else {
            width.value = withTiming(90);
            radius.value = withTiming(0);
            left.value = withTiming(leftStart)
            runOnJS(onMovingGroup)('');
        }

        const positionY = (absoluteY + scrollY.value) - headerPos.value.y;

        top.value = withTiming(positionY - HEIGHT, {
            duration: 16,
        });

        const newPosition = clamp(
            Math.floor(positionY / HEIGHT),
            0,
            itemsCount - 1
        );

        if (newPosition !== exercisePos.value[id]) {
            exercisePos.value = objectMove(
                exercisePos.value,
                exercisePos.value[id],
                newPosition
            );
        }
    }

    const onGestureFinish = (event: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>) => {
        'worklet';
        //find group it dropped it in
        const { absoluteY, absoluteX } = event;

        if (absoluteY < headerPos.value.y && scrollY.value <= 20) {

            const targetGroup = findOverlapGroup(groupsPos, trashPos, absoluteX, headerPos.value.x)

            if (targetGroup && targetGroup !== curGroup) {
                //update exercises
                if (targetGroup === 'trash') {
                    runOnJS(onTrashExercise)(id)
                } else {
                    runOnJS(onExerciseToGroup)(id, targetGroup)
                }
            }
        }

        top.value = exercisePos.value[id] * HEIGHT;
        width.value = withTiming(90);
        left.value = withTiming(leftStart);
        radius.value = withTiming(0);

        runOnJS(onMoving)(false);
        runOnJS(onMovingGroup)('');
        runOnJS(onOverflow)(false);
    }

    const gestureHandler = useAnimatedGestureHandler({
        onStart() {
            runOnJS(onMoving)(true);
            runOnJS(onOverflow)(true);
        },
        onActive(event) {
            onGestureActive(event)
        },
        onFinish(event) {
            onGestureFinish(event)
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            left: left.value,
            top: top.value,
            borderRadius: radius.value,
            zIndex: moving ? 10000 : 0,
            shadowColor: 'black',
            shadowOffset: {
                height: 0,
                width: 0,
            },
            shadowOpacity: withSpring(moving ? 0.2 : 0),
            backgroundColor: BaseColors.white,
            shadowRadius: 10,
            width: `${width.value}%`
        }
    }, [moving])

    return (
        <Animated.View style={animatedStyle}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={{ width: '100%' }}>
                    <Item
                        exercise={exercise}
                        onRemove={onRemove}
                        movingGroup={movingGroup}
                    />
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    )
}, arePropsEqual)

export default RestructureMoveable;
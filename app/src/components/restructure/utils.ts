import { normalize } from "../../utils/tools";
import AutoId from "../../utils/AutoId";
import { GroupPosProps, PositionProps } from "./types";
import { WorkoutExerciseProps } from "../../services/workout/types";

export const HEIGHT = normalize.height(10);

export function clamp(value: any, lowerBound: any, upperBound: any) {
    'worklet';
    return Math.max(lowerBound, Math.min(value, upperBound));
}

export function objectMove(object: any, from: any, to: any) {
    'worklet';
    const newObject = Object.assign({}, object);

    for (const id in object) {
        if (object[id] === from) {
            newObject[id] = to;
        }

        if (object[id] === to) {
            newObject[id] = from;
        }
    }

    return newObject;
}

export function listToObject(list: WorkoutExerciseProps[]) {
    const values = Object.values(list);
    const object: any = {};

    for (let i = 0; i < values.length; i++) {
        let id = values[i]._id;
        if (!id) continue;
        object[id] = i;
    }


    return object;
}

export function findOverlapGroup(groupsPos: GroupPosProps, trash: PositionProps, absoluteX: number, scrollX: number) {
    'worklet';
    const totalX = absoluteX + scrollX

    //check if trash first

    if (totalX > trash.x && totalX < (trash.x + trash.width)) {
        return 'trash'
    }

    const targetGroup = Object.keys(groupsPos).find((g) => {
        const groupData = groupsPos[g];
        const { x, width } = groupData;
        if (totalX > x && totalX < (x + width)) return true
        return false
    })

    if (targetGroup == null) return ''

    return targetGroup
}

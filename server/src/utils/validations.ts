import mongoose from 'mongoose';
import { WorkoutExercisesProps, WorkoutExerciseDataProps } from '../collections/workout-exercises';
import { ProgramTemplateExercisesProps } from '../collections/program-template-exercises';

export function isEmptyObj(obj: Object) {
    return Object.values(obj).some(x => x === null || x === '' || x === undefined);
}

export function isInvalidWorkoutExercises(exercises: WorkoutExercisesProps[] | ProgramTemplateExercisesProps[]) {
    //validate exercises to ensure they are objectIds
    if (exercises.length < 1) return 'Invalid amount of exercises.';

    for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        if (!mongoose.Types.ObjectId.isValid(ex.exerciseUid)) {
            return 'Invalid exercise provided'
        }
    }

}

export function validateYoutubeUrl(url: string) {
    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    // const regex = /https|youtube|com/g;
    const isYoutubeUrl = url.match(regex)

    if (!isYoutubeUrl) return false

    let id = url.split('v=')[1];

    if (!id) return false;

    var ampersandPosition = id.indexOf('&');
    if (ampersandPosition != -1) {
        id = id.substring(0, ampersandPosition);
    }

    if (!id) return false;

    return true;
}

export function isInvalidExerciseData(data: WorkoutExerciseDataProps[], programTemplate?: boolean) {
    if (!data || data.length < 1) return 'Invalid data associated with request';

    for (let i = 0; i < data.length; i++) {
        let curData = data[i];
        const { predictVal, performVal, pct, reps, warmup } = curData;

        if (predictVal === null || typeof predictVal !== 'number') return 'Invalid predicted value associated with request';
        if (programTemplate) {
            if (performVal) return 'Perform field is not required'
        } else {
            if (performVal && typeof performVal !== 'number') return 'Invalid performed value associated with request';
        }
        if (pct === null || typeof pct !== 'number') return 'Invalid percentage associated with request'
        if (reps === null || typeof reps !== 'number') return 'Invalid reps value associated with request'

        if (warmup && typeof warmup !== 'boolean') return 'Invalid warm up value'
    }
}

export function validUri(uri: string) {
    if (!uri || typeof uri !== 'string') return false;
    const storageBase = 'https://firebasestorage.googleapis.com';
    const softleteId = process.env.CLOUD_STORAGE_ID as string;
    return uri.includes(storageBase) && uri.includes(softleteId)
}
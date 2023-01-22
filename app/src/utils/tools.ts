import { Dimensions, Linking } from "react-native";
import { WorkoutExerciseProps, WorkoutExercisesObjProps } from "../services/workout/types";
import { ProgramWorkoutProps, ProgramByWeekProps, WorkoutByWeekProps } from "../services/program/types";
import { replace } from "lodash";
import DateTools from "./DateTools";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const normalize = {
    width: (size: number) => {
        const deviceWidth = width;
        return Math.floor(deviceWidth / size)
    },
    height: (size: number) => {
        const deviceHeight = height;
        return Math.floor(deviceHeight / size)
    }
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function validateUrl(url: string) {
    if (!url) return;

    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    // const regex = /youtube|com/g;

    if (!url.match(regex)) return { invalid: 'Url must be a youtube url.' };

    //check to see if it's the short youtube
    let id = url.split('v=')[1];

    if (!id) {
        //see if the youtube url is short version
        const isShort = url.search('youtu.be/')
        if (isShort) {
            //pieces
            const strs = url.split('youtu.be/')
            id = strs[1];

            //convert url
            url = `https://www.youtube.com/watch?v=${id}`
        }
    } else {
        var ampersandPosition = id.indexOf('&');
        if (ampersandPosition != -1) {
            id = id.substring(0, ampersandPosition);
        }
    }

    if (!id) return { invalid: "Invalid youtube url. Cannot find id" };

    const supportedUrl = await Linking.canOpenURL(url);

    if (!supportedUrl) return { invalid: 'Cannot get the youtube url' };

    return { id }
}

export function genCharArray(charA: string, charZ: string) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i).toUpperCase());
    }
    return a;
}

export function getNumArray(start: number, end: number) {
    let arr = []
    for (let i = start; i <= end; i++) {
        arr.push(i)
    }
    return arr;
}

export function exercisesArrToObj(exercises: WorkoutExerciseProps[]): WorkoutExercisesObjProps {
    let result: any = {};

    exercises.forEach((e: WorkoutExerciseProps) => {
        const { group } = e
        if (result[group]) {
            result[group] = [...result[group], e].sort((a, b) => {
                if (a.order < b.order) return -1
                if (a.order > b.order) return 1
                return 0
            });
        } else {
            result[group] = [e]
        }
    })

    return result;
}

export function programWorkoutsArrToObj(workouts: ProgramWorkoutProps[]): ProgramByWeekProps {
    //order by week
    //sort
    workouts.sort((a, b) => a.daysFromStart - b.daysFromStart)

    let workoutObj: any = {}

    for (let i = 0; i < workouts.length; i++) {
        let curWorkout = workouts[i];

        let quot = Math.floor(curWorkout.daysFromStart / 7)
        let remainder = curWorkout.daysFromStart % 7

        if (workoutObj[quot] === undefined) {
            workoutObj[quot] = []
        }

        workoutObj[quot].push({
            ...curWorkout,
            dayOfWeek: remainder
        })
    }

    //init the empty weeks
    let keys = Object.keys(workoutObj);

    keys.sort((a, b) => parseInt(a) - parseInt(b)).forEach((k, i) => {
        if (i === keys.length - 1 && i !== 0) return;
        const kInt = parseInt(k);
        let dif = 0;

        if (i === 0) {
            //check if any before
            dif = kInt - 0;
            if (dif) {
                for (let j = dif; j >= 0; j--) {
                    if (!workoutObj[kInt - j]) {
                        workoutObj[kInt - j] = []
                    }
                }
            }
        } else {
            dif = parseInt(keys[i + 1]) - kInt;
            if (dif) {
                for (let j = dif - 1; j >= 0; j--) {
                    if (!workoutObj[kInt + j]) {
                        workoutObj[kInt + j] = []
                    }
                }
            }
        }
    })

    return workoutObj
}

export function groupByDayOfWeek(workouts: WorkoutByWeekProps[]) {
    let dayObj: any = {};

    for (let i = 0; i < workouts.length; i++) {
        const w = workouts[i];
        const dayStr = w.dayOfWeek.toString();
        if (dayObj[dayStr]) {
            dayObj[dayStr].push(w)
        } else {
            dayObj[dayStr] = [w]
        }
    }
    return dayObj
}

export function convertDaysToWeekObj(days: number) {
    let quot = Math.floor(days / 7)
    let remainder = days % 7
    return {
        week: quot,
        day: remainder
    }
}

export function convertObjToDays(week: number, day: number) {
    return (week * 7) + day;
}

export function strToFloat(n: string) {
    //check if theres decimal
    if (n.includes(".")) {
        //decimal number
        const ns = n.split('.');
        const nOne = parseInt(ns[0]);
        if (ns[1]) {
            if (ns[1].length < 2) {
                return (nOne + '.' + parseInt(ns[1]))
            } else if (ns[1].length > 2) {
                //take the third number and replace it with the second
                const newN = ns[1][0] + ns[1][2];
                const nTwo = parseInt(newN);
                return parseFloat(nOne + '.' + nTwo).toFixed(2);
            } else {
                const nTwo = parseInt(ns[1].slice(0, 2));
                return parseFloat(nOne + '.' + nTwo).toFixed(2);
            }
        } else {
            return (nOne + '.')
        }
    } else {
        //full number
        return parseInt(n)
    }
}

export const capitalize = (str: string, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
;


export const getTimeAgo = (time?: string) => {
    if (!time) return '';

    const { mil, days } = DateTools.dateDiffInDays(new Date(time), new Date())

    if (days > 0) {
        return `${days}d`
    }

    const seconds = Math.floor(mil / 1000);
    if (seconds < 60) {
        if (seconds < 1) return `now`
        return `${seconds}s`
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m`
    }

    const hours = Math.floor(minutes / 60);
    return `${hours}h`
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function getYoutubeUrl(id: string) {
    return `https://www.youtube.com/watch?v=${id}`
}

export function getYoutubeThumbNail(id: string) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
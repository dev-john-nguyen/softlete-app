import { genCharArray, getNumArray } from "./tools";

export default {
    daysOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    months: ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"],
    workoutFrequencies: ['single', 'weekly', 'daily'],
    workoutFrequenciesObj: {
        single: 'single',
        weekly: 'weekly',
        daily: 'daily'
    },
    primaryFont: 'Raleway-Bold',
    secondaryFont: 'Lato-Regular',
    longToShortMeasurments: {
        "pounds": 'lbs',
        'kilos': 'kgs',
        'seconds': 'secs',
        'minutes': 'mins',
        'hours': 'hrs',
        'inches': 'ins'
    },
    measurements: [{
        long: 'pounds',
        short: 'lbs'
    }, {
        long: 'kilos',
        short: 'kgs'
    }, {
        long: 'seconds',
        short: 'secs'
    }, {
        long: 'minutes',
        short: 'mins'
    }, {
        long: 'hours',
        short: 'hrs'
    }, {
        long: 'inches',
        short: 'ins'
    }],
    abc: genCharArray('a', 'z'),
    setsAndReps: getNumArray(1, 20),
    autoSaveDuration: 10000,
    videoLarge: {
        width: 500,
        height: 281.25
    },
    videoDim: {
        width: 300,
        height: 168.75,
    },
    videoMedDim: {
        width: 200,
        height: 112.50,
    },
    videoSmallDim: {
        width: 80,
        height: 45
    }
} as any
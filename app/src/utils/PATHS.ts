import { Categories } from '../services/exercises/types';

export default {
  video: {
    upload: 'api/videos/upload',
    remove: 'api/videos/remove',
  },
  image: {
    upload: 'api/images/upload',
    remove: 'api/images/remove',
  },
  report: {
    workout: 'api/report/create/workout',
    exercise: 'api/report/create/exercise',
    user: 'api/report/create/user',
  },
  bug: {
    create: 'api/bug/create',
  },
  goals: {
    upsert_exercise: 'api/goals/upsert-exercise',
    upsert_health: 'api/goals/upsert-health',
    get: (userUid: string) => `api/goals/get/${userUid}`,
    delete_exercise: (goalId: string) => `api/goals/delete-exercise/${goalId}`,
    get_exercise_goal_analytics: (
      exerciseUid: string,
      goal: string,
      startDate: string,
      endDate: string,
    ) =>
      `api/goals/exercise-goal-analytics/${exerciseUid}?goal=${goal}&startDate=${startDate}&endDate=${endDate}`,
  },
  subscription: {
    getPubKey: 'api/subscription/pub-key',
    createSubscription: 'api/subscription/create',
    updatePaymentMethod: 'api/subscription/update-payment-method',
    subscribe: 'api/subscription/iap/subscribe',
  },
  signin: {
    register: 'api/signin/register',
    login: 'api/signin/login',
  },
  chat: {
    create: 'api/chat/create',
    fetch: (userUid?: string, chatId?: string) =>
      `api/chat/fetch?${userUid ? `userUid=${userUid}` : ''}${
        chatId ? `&chatId=${chatId}` : ''
      }`,
    get: `api/chat/get`,
    remove: 'api/chat/remove',
    messages: {
      send: 'api/chat/messages/send',
    },
  },
  friends: {
    getFriends: (userUid: string) => `api/user/friends/get/friends/${userUid}`,
    getAll: `api/user/friends/get/all`,
    update: 'api/user/friends/update',
  },
  user: {
    updateProfile: 'api/user/update/profile',
    updatePinExercises: 'api/user/update/pin-exercises',
    getProfile: 'api/user/get',
    token: 'api/user/update/token',
    block: 'api/user/block',
    unblock: 'api/user/unblock',
    remove: 'api/user/deactivate',
  },
  exercises: {
    create: 'api/exercises/create',
    updateProps: 'api/exercises/update/props',
    updateMeas: 'api/exercises/update/meas',
    remove: 'api/exercises/remove',
    find: (name: string, userUid: string) =>
      `api/exercises/find?name=${name}&userUid=${userUid ? userUid : ''}`,
    search: (name: string, userUid: string, limit?: number) =>
      `api/exercises/search?name=${name}&userUid=${
        userUid ? userUid : ''
      }&limit=${limit ? limit : 5}`,
    fetchBulkUsers: (exerciseUids: string[], userUid: string) => {
      let strArr = ``;

      exerciseUids.forEach(id => {
        strArr += `exUids=${id}&`;
      });

      return `api/exercises/get/bulk/users?${strArr}&userUid=${userUid}`;
    },
    fetchAllUsers: (userUid: string) =>
      `api/exercises/get/bulk/users/all?userUid=${userUid}`,
    fetchAllSoftlete: (userUid: string) =>
      `api/exercises/get/bulk/softlete/all?userUid=${userUid}`,
    searchByCat: (category: Categories) =>
      `api/exercises/search/category?category=${category}`,
  },
  workouts: {
    create: 'api/workouts/create',
    fetch: (FromDate: string, toDate: string, userUid: string) =>
      `api/workouts/get/${userUid}?fromDate=${FromDate}&toDate=${toDate}`,
    fetchOne: (userUid: string, workoutUid: string) => {
      return `api/workouts/get/${userUid}/${workoutUid}`;
    },
    remove: 'api/workouts/remove',
    removeExercise: 'api/workouts/remove/exercise',
    duplicate: 'api/workouts/duplicate',
    updateStatus: 'api/workouts/update/status',
    updateData: 'api/workouts/update/data',
    updateExercises: 'api/workouts/update/exercises',
    updateHeader: 'api/workouts/update/header',
    updateHealthData: 'api/workouts/update/health-data',
    updateWorkoutRoute: 'api/workouts/update/workout-route',
    batch: {
      images: 'api/workouts/update/images',
      healthData: 'api/workouts/update/batch/health-data',
    },
    complete: 'api/workouts/complete',
    getExerciseData: (
      FromDate: string,
      toDate: string,
      userUid: string,
      exerciseUids: string[],
    ) => {
      let strArr = ``;
      exerciseUids.forEach((id, i) => {
        strArr += `${i > 0 ? '&' : ''}exerciseUids=${id}`;
      });
      return `api/workouts/get/exercise/data?userUid=${userUid}&fromDate=${FromDate}&toDate=${toDate}&${strArr}`;
    },
    getExerciseDataByDates: (
      dates: string[],
      ids: string[],
      userUid: string,
    ) => {
      let exerciseUids = ``;
      let datesArrStr = ``;
      dates.forEach(date => {
        datesArrStr += `dates=${date}&`;
      });
      ids.forEach(id => {
        exerciseUids += `exerciseUids=${id}&`;
      });
      return `api/workouts/get/exercise/data/dates?userUid=${userUid}&${datesArrStr}${exerciseUids}`;
    },
    getAllHealthData: (userUid: string) => {
      return `api/workouts/get/health-data?userUid=${userUid}`;
    },
    like: 'api/workouts/like',
    getWorkoutRoute: (
      userUid: string,
      activityId?: string,
      workoutUid?: string,
    ) =>
      `api/workouts/get/workout-route/${userUid}?activityId=${activityId}&workoutUid=${workoutUid}`,
  },
  programs: {
    get: (userUid: string) => `api/programs/get?userUid=${userUid}`,
    create: 'api/programs/create',
    createWorkout: 'api/programs/workouts/create',
    updateWorkoutHeader: 'api/programs/workouts/update/header',
    updateWorkoutExercises: 'api/programs/workouts/update/exercises',
    updateExerciseData: 'api/programs/workouts/update/data',
    updateWoHealthData: 'api/programs/workouts/update/health-data',
    remove: 'api/programs/remove',
    removeExercise: 'api/programs/remove/exercise',
    generate: 'api/programs/generate',
    update: 'api/programs/update/header',
    like: 'api/programs/like',
    getWorkouts: (userUid: string, programUid: string) =>
      `api/programs/workouts/get?userUid=${userUid}&programUid=${programUid}`,
    getWorkoutExercises: (userUid: string, programWorkoutUid: string) =>
      `api/programs/workouts/exercises/get?userUid=${userUid}&programWorkoutUid=${programWorkoutUid}`,
    duplicateWorkout: 'api/programs/workouts/duplicate',
    removeWorkout: 'api/programs/workouts/remove',
    generated: {
      get: (userUid: string) => `api/programs/generated/get?userUid=${userUid}`,
      remove: `api/programs/generated/remove`,
    },
    addAccessCode: `api/programs/access/add`,
    removeAccessCode: `api/programs/access/remove`,
  },
  misc: {
    get: 'api/misc/get',
  },
  global: {
    get: 'api/global/get',
  },
  notificatons: {
    get: 'api/notifications/get',
  },
};

export const SERVERURL = 'http://localhost:3000/';
// export const SERVERURL = 'http://192.168.86.38:3000/';
// export const SERVERURL = 'https://softlete-sandbox.herokuapp.com/';

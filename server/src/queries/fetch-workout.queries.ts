import mongoose from 'mongoose';
import Workout from '../collections/workouts';

export const fetchWorkout = async (workoutUid: string) => {
  const response = await Workout.aggregate([
    // Match the workout by its UID
    { $match: { _id: new mongoose.Types.ObjectId(workoutUid) } },

    // // Join with the Exercise collection
    {
      $lookup: {
        from: 'workout-exercises', // the collection to join
        localField: '_id', // field from the input documents
        foreignField: 'workoutUid', // field from the documents of the "from" collection
        as: 'exercises', // output array field with the joined documents
        pipeline: [
          {
            $lookup: {
              from: 'exercises',
              localField: 'exerciseUid',
              foreignField: '_id',
              as: 'common_details',
              pipeline: [
                {
                  $lookup: {
                    from: 'user-exercise-measurements',
                    localField: '_id',
                    foreignField: 'exerciseUid',
                    as: 'custom_measurements',
                  },
                },
                {
                  $addFields: {
                    custom_measurements: {
                      $arrayElemAt: ['$custom_measurements', 0],
                    },
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'user-exercises',
              localField: 'exerciseUid',
              foreignField: '_id',
              as: 'user_details',
              pipeline: [
                {
                  $lookup: {
                    from: 'user-exercise-measurements',
                    localField: '_id',
                    foreignField: 'exerciseUid',
                    as: 'custom_measurements',
                  },
                },
                {
                  $addFields: {
                    custom_measurements: {
                      $arrayElemAt: ['$custom_measurements', 0],
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              details: {
                $concatArrays: ['$common_details', '$user_details'],
              },
              data: {
                $map: {
                  input: '$data',
                  as: 'item',
                  in: {
                    $mergeObjects: [
                      '$$item',
                      {
                        performVal: { $toDouble: '$$item.performVal' },
                        predictVal: { $toDouble: '$$item.predictVal' },
                      },
                    ],
                  },
                },
              },
              calcRef: { $toDouble: '$calcRef' },
            },
          },
          {
            $addFields: {
              details: {
                $arrayElemAt: ['$details', 0], // This will overwrite the previous stage
              },
            },
          },
        ],
      },
    },
  ]);
  return response[0];
};

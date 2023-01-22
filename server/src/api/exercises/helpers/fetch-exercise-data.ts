import Video, { VideoSchemaProps } from '../../../collections/videos';
import UserExerciseMeas from '../../../collections/user-exercise-measurements';
import { ExerciseSchemaProps } from '../../../collections/exercises';
import mongoose from 'mongoose';

type DocProps = (mongoose.Document<any, any, ExerciseSchemaProps> &
  ExerciseSchemaProps & {
    _id: mongoose.Types.ObjectId;
  })[];

async function fetchExerciseData(
  userExDocs: DocProps,
  softExDocs: DocProps,
  userUid: string,
) {
  //get list of exerciseUids
  const exUidsToFetch: mongoose.Types.ObjectId[] = [];
  const softUidsToFetch: mongoose.Types.ObjectId[] = [];
  const videosToFetch: string[] = [];

  userExDocs.forEach(d => {
    exUidsToFetch.push(d._id);
    if (d.videoId) {
      videosToFetch.push(d.videoId);
    }
  });

  softExDocs.forEach(d => {
    softUidsToFetch.push(d._id);
    if (d.videoId) {
      videosToFetch.push(d.videoId);
    }
  });

  const exMeasDocs = await UserExerciseMeas.find({
    userUid: userUid,
    exerciseUid: { $in: [...exUidsToFetch, ...softUidsToFetch] },
  }).select({
    measCat: 1,
    measSubCat: 1,
    exerciseUid: 1,
  });

  //fetch all videos associated with the exercises
  let exVideos: VideoSchemaProps[] = [];
  if (videosToFetch.length > 0) {
    exVideos = await Video.find({
      userUid: userUid,
      videoId: { $in: videosToFetch },
    });
  }

  const exsToSend: any[] = [];

  userExDocs.forEach(doc => {
    const docObj = doc.toObject();
    const measDoc = exMeasDocs.find(m => m.exerciseUid.equals(doc._id));
    let measObj = {};
    let url = '';
    let thumbnail = '';

    if (doc.videoId && exVideos.length > 0) {
      const videoDoc = exVideos.find(vid => vid.videoId === doc.videoId);
      if (videoDoc) {
        url = videoDoc.url;
        thumbnail = videoDoc.thumbnail;
      }
    }

    if (measDoc) {
      const { measCat, measSubCat } = measDoc.toObject();
      measObj = { measCat, measSubCat };
    }

    exsToSend.push({
      ...docObj,
      ...measObj,
      url,
      thumbnail,
      owner: true,
    });
  });

  softExDocs.forEach(doc => {
    const docObj = doc.toObject();
    const measDoc = exMeasDocs.find(m => m.exerciseUid.equals(doc._id));
    let measObj = {};
    let url = '';
    let thumbnail = '';

    if (doc.videoId && exVideos.length > 0) {
      const videoDoc = exVideos.find(vid => vid.videoId === doc.videoId);
      if (videoDoc) {
        url = videoDoc.url;
        thumbnail = videoDoc.thumbnail;
      }
    }

    if (measDoc) {
      const { measCat, measSubCat } = measDoc.toObject();
      measObj = { measCat, measSubCat };
    }

    exsToSend.push({
      ...docObj,
      ...measObj,
      url,
      thumbnail,
      softlete: true,
    });
  });

  return exsToSend;
}

export default fetchExerciseData;

import { genWoImagePath, getExVideoPath } from "./media-paths";
import Images from '../collections/images';
import Videos from '../collections/videos';
import admin from 'firebase-admin';

export function removeImageFromStorage(uid: string, imageIds: string[]) {
    if (imageIds.length < 1) return;

    const bucket = admin.storage().bucket();

    imageIds.forEach(imageId => {
        const path = genWoImagePath(uid, imageId)
        bucket.file(path).delete()
            .catch(err => console.log(err))
    })

    Images.deleteMany({ imageId: { $in: imageIds }, uid: uid })
        .catch(err => console.log(err))
}

export function removeVideoFromStorage(uid: string, videoIds: string[]) {
    if (videoIds.length < 1) return;

    const bucket = admin.storage().bucket();

    videoIds.forEach(videoId => {
        const prefix = getExVideoPath(uid, videoId)
        bucket.deleteFiles({ prefix: prefix }).catch(err => console.log(err))
    })

    Videos.deleteMany({ videoId: { $in: videoIds }, userUid: uid }).catch(err => console.log(err))
}
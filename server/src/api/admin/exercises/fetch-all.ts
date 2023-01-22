const router = require('express').Router();
import Exercises from '../../../collections/exercises';
import Videos from '../../../collections/videos';
import errorCatch from '../../../utils/error-catch';

router.get('/', async (req: any, res: any, next: any) => {
  return Exercises.find()
    .then(docs => {
      if (docs.length < 1) return res.send([]);

      const videoIds = docs
        .filter(d => d.videoId)
        .map(d => d.videoId as string);

      if (videoIds.length < 1) return res.send(docs);

      Videos.find({ videoId: { $in: videoIds } }).then(vidDocs => {
        const docsWhVids = docs.map(doc => {
          let url = '';
          let thumbnail = '';

          if (doc.videoId && vidDocs.length > 0) {
            const videoDoc = vidDocs.find(vid => vid.videoId === doc.videoId);
            if (videoDoc) {
              url = videoDoc.url;
              thumbnail = videoDoc.thumbnail;
            }
          }

          return {
            ...(doc.toObject() as any),
            url,
            thumbnail,
            softlete: true,
          };
        });

        res.send(docsWhVids);
      });
    })
    .catch(err => errorCatch(err, res, next));
});

export default router;

const router = require("express").Router();
import Exercises from "../../../collections/exercises";
import errorCatch from "../../../utils/error-catch";

router.post("/", async (req: any, res: any, next: any) => {
  if (!req.body) return res.status(400).send("Invalid request");

  const {
    name,
    description,
    category,
    localUrl,
    localThumbnail,
    equipment,
    muscleGroup,
    youtubeId,
    videoId,
    measCat,
    measSubCat,
  } = req.body;

  if (!name) return res.status(400).send("Name is required.");

  if (youtubeId && typeof youtubeId !== "string")
    return res.status(400).send("Invalid youtube url.");

  if (localUrl && typeof localUrl !== "string")
    return res.status(400).send("Invalid video url");

  if (localThumbnail && typeof localThumbnail !== "string")
    return res.status(400).send("Invalid video thumbnail");

  if (videoId && typeof videoId !== "string")
    return res.status(400).send("Invalid video id");

  const data = {
    name: name,
    description,
    localUrl: localUrl ? localUrl : "",
    category,
    equipment,
    muscleGroup,
    youtubeId: youtubeId ? youtubeId : "",
    videoId: videoId ? videoId : "",
    localThumbnail: localThumbnail ? localThumbnail : "",
    measCat,
    measSubCat,
  };

  //check if exercise already exists
  const docs = await Exercises.countDocuments({ name: data.name }).catch(
    (err) => console.log(err)
  );

  if (docs)
    return res.status(401).send("Exercise already exists. Please try again.");

  Exercises.findOneAndUpdate({ videoId }, data, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((doc) => {
      doc
        ? res.send(doc.toObject())
        : res.status(500).send("Unexpected error occurred.");
    })
    .catch((err) => errorCatch(err, res, next));
});

export default router;

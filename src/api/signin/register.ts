import express from 'express';
import UserModel from '../../collections/users';
import rateLimit from 'express-rate-limit';
const router = express.Router();

function validateStr(val: string) {
  return val && typeof val === 'string';
}

function validateUsername(val: string) {
  const reg = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  return reg.test(val);
}

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

//prevent users from spamming this route with many account creations

router.post(
  '/',
  createAccountLimiter,
  async (req: any, res: any, next: any) => {
    //verify username to ensure it doesn't exists
    //create firebase admin
    //init profile
    //send data backsign

    const { uid } = req.headers;

    if (!uid) return res.status(401).send('cannot find user id.');

    const { username, name, email } = req.body;

    if (!validateStr(username))
      return res.status(401).send('Found more than one invalid value.');

    if (name && !validateStr(name))
      return res.status(401).send('Invalid request.');

    if (email && !validateStr(email))
      return res.status(401).send('Invalid request. Email is invalid.');

    if (
      username.length < 8 ||
      username.length > 20 ||
      !validateUsername(username)
    )
      return res.status(401).send('Invalid username.');

    try {
      const exists = await UserModel.countDocuments({ uid: uid });
      if (exists > 0) return res.status(401).send('Account already exists.');

      const usernameCount = await UserModel.countDocuments({
        username: username,
      });
      if (usernameCount > 0)
        return res.status(401).send('Username already taken.');
    } catch (err) {
      console.log(err);
      return res.status(500).send('Unexpected error occurred.');
    }

    const newUser = new UserModel({
      uid: uid,
      name: name,
      username: username,
      email,
    });

    try {
      await newUser.save();
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(
          'Unexpected error occured when initializing your account. Please try again.',
        );
    }

    res.send(newUser.toObject());
    //store user in userModel
  },
);

export default router;

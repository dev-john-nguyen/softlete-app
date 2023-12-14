const router = require('express').Router();
import UserModel from '../../../collections/users';
import { validUri } from '../../../utils/validations';

//I will need to get token from the client that can be found through firebase auth SDK
enum values {
    name = 'name',
    athlete = 'athlete',
    bio = 'bio',
    isPrivate = 'isPrivate',
    imageUri = 'imageUri'
}

const keysOfValues = Object.keys(values)

router.post('/', (req: any, res: any) => {
    //user has a id token
    //verify token
    const { uid } = req.headers;

    if (!uid) {
        return res.status(401).send("cannot find user id.")
    }

    const isValidKeys = Object.keys(req.body).every(k => keysOfValues.includes(k))

    if (!isValidKeys) {
        return res.status(400).send('Invalid keys associated with request')
    }

    let key: keyof typeof req.body;
    let invalid = false;
    for (key in req.body) {

        if (key !== values.isPrivate && key !== values.bio && req.body[key] && typeof req.body[key] !== 'string') {
            invalid = true
        }

        if (key === values.isPrivate && typeof req.body[key] !== 'boolean') {
            invalid = true
        }

    }

    if (invalid) return res.status(400).send('Invalid values associated with request')

    const { name, athlete, bio, isPrivate, imageUri } = req.body;

    const newProfileProps: any = {
        name, athlete, bio, isPrivate
    }


    if (imageUri) {
        //validate imageUri
        if (typeof imageUri !== 'string' || !validUri(imageUri)) return res.status(400).send("Invalid image url.")
        //clear
        newProfileProps.imageUri = imageUri
    }

    UserModel.findOneAndUpdate({ uid: uid }, newProfileProps, { runValidators: true, new: true })
        .then((doc) => {
            if (doc) {
                return res.send(doc.toObject())
            }
            res.status(500).send("Failed to save profile")
        })
        .catch((err: any) => {
            console.log(err)
            res.status(500).send('unexpected occured while updating profile')
        })

})

export default router;
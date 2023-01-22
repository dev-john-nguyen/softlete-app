const router = require('express').Router();
import UserModel from '../../collections/users';

//I will need to get token from the client that can be found through firebase auth SDK

router.get('/', async (req: any, res: any) => {
    //user has a id token
    //verify token

    const { uid } = req.headers;

    if (!uid) {
        return res.status(401).send("cannot find user id.")
    }

    try {
        const query = await UserModel.findOne({ uid: uid }).exec()
        res.send(query)
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }
})

export default router;
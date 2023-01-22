import Users from '../../collections/users';

export default function validateAdmin(req: any, res: any, next: any) {
    const { uid } = req.headers;
    if (!uid) return res.status(401).send("Cannot find your user id. Authorization rejected.");

    Users.findOne({ uid, admin: true })
        .then((doc) => {
            if (doc) {
                next();
            } else {
                res.status(401).send("Not an authorized user.")
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send("Unexpected error occurred.")
        })
    //fetch admins
}

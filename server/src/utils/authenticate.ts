import admin from 'firebase-admin';

export default function authenticate(req: any, res: any, next: any) {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        res.statusMessage = 'Unauthorized Header. Access Denied'
        return res.status(401).send('Unauthorized Header. Access Denied')
    }

    const token = header.substring(7, header.length)

    if (!token) {
        res.statusMessage = 'Unauthorized Header. Access Denied'
        return res.status(401).send('Unauthorized Header. Access Denied')
    }

    //verify users previous ip addres to prevent threft
    //docs can be found here
    //https://firebase.google.com/docs/auth/admin/manage-sessions
    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            //attach uid to body
            if (!decodedToken.email_verified) return res.status(401).send('Your email needs to be verified.')
            req.headers.uid = decodedToken.uid;
            next()
            // ...
        }).catch(function (error) {
            if (error.errorInfo.code === 'auth/id-token-expired') {
                res.status(401).send({ tokenExpired: true })
                return;
            }
            console.log(error);
            return res.status(401).send('Unauthorized Header. Access Denied')
        });
}
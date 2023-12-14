import admin from 'firebase-admin';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default function authIo(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, next: any) {

    const header = socket.handshake.auth.token;


    if (!header || !header.startsWith("Bearer ")) {
        const err = new Error("not authorized");
        return next(err);
    }

    const token = header.substring(7, header.length)

    if (!token) {
        const err = new Error("not authorized");
        return next(err);
    }

    //verify users previous ip addres to prevent threft
    //docs can be found here
    //https://firebase.google.com/docs/auth/admin/manage-sessions
    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            //attach uid to body
            next()
            // ...
        }).catch(function (error) {
            console.log(error);
            const err = new Error("not authorized");
            next(err);
        });
}
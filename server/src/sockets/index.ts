import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import instances from './instances';
import _ from 'lodash';

const onSockets = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    console.log('connect');

    socket.on('init', ({ uid }: { uid: string }) => {
        if (uid) {
            // if (instances[uid]?.socketId) {
            //     socket.emit("signout", "You are logged in on another device!")
            // } else {
            //     instances[uid] = { socketId: socket.id }
            // }
            instances[uid] = { socketId: socket.id }
        }
    })

    socket.on("disconnect", (reason) => {
        console.log(reason)
        const uid = _.findKey(instances, { socketId: socket.id })
        if (uid) {
            instances[uid] = undefined;
        }
    });
}

export default onSockets
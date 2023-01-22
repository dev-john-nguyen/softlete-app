import { io } from "socket.io-client"
import axios from "axios"
import { SERVERURL } from "../../utils/PATHS"

const socket = io(SERVERURL, {
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 100,
    auth: { token: axios.defaults.headers.common['Authorization'] }
})

export default socket
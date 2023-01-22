import axios from "axios";
import { Alert } from "react-native";
import PATHS, { SERVERURL } from "../../utils/PATHS";

const reportWo = (userUid?: string, workoutUid?: string) => {
    if (!userUid || !workoutUid) return;

    Alert.prompt('Report', '', ((txt) => {
        axios.post(SERVERURL + PATHS.report.workout, {
            userUid,
            workoutUid,
            description: txt
        })
            .then(() => Alert.alert("Reported"))
            .catch(err => console.log(err))
    }))
}

export default reportWo;
import axios from "axios";
import { Alert } from "react-native";
import PATHS, { SERVERURL } from "../../utils/PATHS";

const reportExercise = (reportedUserUid?: string, userUid?: string, exerciseUid?: string) => {
    if (!reportedUserUid || !userUid || !exerciseUid) return;

    Alert.prompt('Report', '', ((txt) => {
        axios.post(SERVERURL + PATHS.report.exercise, {
            userUid: reportedUserUid,
            description: txt,
            exerciseUid: exerciseUid
        })
            .then(() => Alert.alert("Reported"))
            .catch(err => console.log(err))
    }))
}

export default reportExercise;
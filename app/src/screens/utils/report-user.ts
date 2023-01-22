import axios from "axios";
import { Alert } from "react-native";
import PATHS, { SERVERURL } from "../../utils/PATHS";

const reportUser = (userUid?: string) => {
    if (!userUid) return;

    Alert.prompt('Report', '', ((txt) => {
        axios.post(SERVERURL + PATHS.report.user, {
            userUid,
            description: txt
        })
            .then(() => Alert.alert("Reported"))
            .catch(err => console.log(err))
    }))
}

export default reportUser;
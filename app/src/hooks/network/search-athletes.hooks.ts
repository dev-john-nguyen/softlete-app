import { useState } from "react";
import { AppDispatch } from "../../../App";
import { INSERT_ATHLETE_PROFILE } from "../../services/athletes/actionTypes";
import ATHLETEPATHS from "../../services/athletes/ATHLETEPATHS";
import { AthleteProfileProps } from "../../services/athletes/types";
import request from "../../services/utils/request";

interface Props {
    uid: string
    dispatch: AppDispatch
}

export function useFetchAthletes({ uid, dispatch }: Props) {
    const [fetching, setFetching] = useState(false);
    const [profiles, setProfiles] = useState<AthleteProfileProps[]>([]);

    const onSearch = async (query: string) => {
        if (fetching) return;
        if (!query) return;
        setFetching(true)
        await request("GET", ATHLETEPATHS.search(query), dispatch)
            .then(({ data }: { data?: AthleteProfileProps[] }) => {
                if (data) {
                    const fitlerData = data.filter(profile => profile.blockUids.find(id => id === uid) ? false : true)
                    dispatch({ type: INSERT_ATHLETE_PROFILE, payload: fitlerData })
                    setProfiles(fitlerData)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        setFetching(false)
    }

    return { profiles, onSearch }
}
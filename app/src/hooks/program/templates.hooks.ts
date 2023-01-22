import { useState, useEffect } from "react";
import { AppDispatch } from "../../../App";
import { ProgramProps, ProgramHeaderProps, ProgramActionProps } from "../../services/program/types";
import request from "../../services/utils/request";
import { SectionProps } from "../../types/program/program.types";
import PATHS from "../../utils/PATHS";

interface Props {
    softleteUid: string
    dispatch: AppDispatch
    fetchPrograms: ProgramActionProps['fetchPrograms']
    programTemplates: ProgramProps[]
}


export function useTemplates({ softleteUid, dispatch, fetchPrograms, programTemplates }: Props) {
    const [programs, setPrograms] = useState<SectionProps[]>([]);
    const [softPrograms, setSoftPrograms] = useState<ProgramProps[]>([])

    useEffect(() => {
        //softlete username
        request("GET", PATHS.programs.get(softleteUid), dispatch)
            .then(async ({ data }: { data?: ProgramHeaderProps[] }) => {
                if (data) setSoftPrograms(data)
            })
            .catch(err => {
                console.log(err)
            })

        //could return the programs instead of waiting for state update
        fetchPrograms().catch(err => console.log(err))
    }, [])


    useEffect(() => {
        let templates: SectionProps[] = [{
            title: "Softlete",
            data: softPrograms
        }]

        if (programTemplates.length > 0) {
            templates.unshift({

                title: 'Me',
                data: programTemplates

            })
        }

        setPrograms(templates)
    }, [programTemplates, softPrograms])

    return { programs }
}
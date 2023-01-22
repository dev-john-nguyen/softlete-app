import { uniqueId } from "lodash"
import AutoId from "../../utils/AutoId"
import DateTools from "../../utils/DateTools"

export type SelectedDateProps = {
    date: Date
    key: string
}


export const genNewDate = () => ({
    date: new Date(), key: uniqueId()
})

export const DEFAULT_DATES = {
    start: { date: DateTools.getMonthPrevious(new Date(), 1), key: AutoId.newId(10) },
    end: { date: new Date(), key: AutoId.newId(10) }
}

export type AnalyticDataProps = {
    date: Date
    avg: number
    min: number
    max: number
}

export enum AnalyticsFilters {
    LOW = 'LOW',
    HIGH = 'HIGH',
    AVG = 'AVG'
}

export enum DateSelectionTypes {
    range = 'range',
    multiple = 'multiple',
}

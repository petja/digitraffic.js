import { DateTime } from 'luxon'

type CountryCode = 'FI' | 'RU'

interface TimetableRowProps {
  trainStopping: boolean
  stationShortCode: string
  stationUICCode: number
  countryCode: CountryCode
  type: 'ARRIVAL' | 'DEPARTURE'
  commercialStop?: boolean
  commercialTrack?: string
  cancelled: boolean
  estimateSource?: 'MIKU_USER' | 'LIIKE_USER' | 'LIIKE_AUTOMATIC' | 'COMBOCALC'
  unknownDelay?: boolean
  differenceInMinutes?: number
  causes: {
    categoryCodeId: number
    detailedCategoryCodeId: number
    thirdCategoryCodeId: number
    categoryCode: string
    detailedCategoryCode: string
    thirdCategoryCode: string
  }[]
  trainReady?: {
    source: string
    accepted: string
    timestamp: string
  }
}

export interface TimetableRowJSON extends TimetableRowProps {
  scheduledTime: string
  liveEstimateTime?: string
  actualTime?: string
}

export interface TimetableRow extends TimetableRowProps {
  scheduledTime: DateTime
  liveEstimateTime?: DateTime
  actualTime?: DateTime
}

export const toJSON = (row: TimetableRow): TimetableRowJSON => ({
  ...row,
  scheduledTime: row.scheduledTime.toISO(),
  liveEstimateTime: row.liveEstimateTime && row.liveEstimateTime.toISO(),
  actualTime: row.actualTime && row.actualTime.toISO(),
})

export const fromJSON = (json: TimetableRowJSON): TimetableRow => ({
  ...json,
  scheduledTime: DateTime.fromISO(json.scheduledTime),
  liveEstimateTime: json.liveEstimateTime ? DateTime.fromISO(json.liveEstimateTime) : void 0,
  actualTime: json.actualTime ? DateTime.fromISO(json.actualTime) : void 0,
})

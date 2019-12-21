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
  causes: Array<{
    categoryCodeId: number
    detailedCategoryCodeId: number
    thirdCategoryCodeId: number
    categoryCode: string
    detailedCategoryCode: string
    thirdCategoryCode: string
  }>
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

export const toJSON = async (row: TimetableRow): Promise<TimetableRowJSON> => ({
  ...row,
  scheduledTime: row.scheduledTime.toISO(),
  liveEstimateTime: row.liveEstimateTime?.toISO(),
  actualTime: row.actualTime?.toISO(),
})

export const fromJSON = async (json: TimetableRowJSON): Promise<TimetableRow> => ({
  ...json,
  scheduledTime: DateTime.fromISO(json.scheduledTime),
  liveEstimateTime:
    json.liveEstimateTime !== undefined ? DateTime.fromISO(json.liveEstimateTime) : undefined,
  actualTime: json.actualTime !== undefined ? DateTime.fromISO(json.actualTime) : undefined,
})

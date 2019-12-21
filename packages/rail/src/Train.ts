import { DateTime } from 'luxon'

import API from './API'
import {
  TimetableRow,
  TimetableRowJSON,
  fromJSON as timetableRowFromJSON,
  toJSON as timetableRowToJSON,
} from './TimetableRow'
import { date2ISO } from './utils'
import { DigitrafficError, DigitrafficErrorCode } from './errors'

export interface TrainPropsCommon {
  trainNumber: number
  /**
   * Departure date on the first station of the train. Formatted in ISO 8601.
   */

  version?: number
  operatorUICCode: number
  operatorShortCode: string
  trainType: string
  trainCategory: TrainCategory
}

export type TrainCategory =
  | 'Commuter'
  | 'Locomotive'
  | 'Shunting'
  | 'Long-distance'
  | 'Cargo'
  | 'On-track machines'
  | 'Test drive'

export type TimeTableType = 'REGULAR' | 'ADHOC'

interface TrainProps extends TrainPropsCommon {
  commuterLineID?: string
  runningCurrently: boolean
  cancelled: boolean
  timetableType: TimeTableType
  deleted?: boolean
}

export interface TrainJSON extends TrainProps {
  departureDate: string
  timeTableRows: TimetableRowJSON[]
  timetableAcceptanceDate: string
}

/**
 * Train information and timetable
 * @see https://www.digitraffic.fi/rautatieliikenne/#junat
 */
export interface Train extends TrainProps {
  trainId: string
  departureDate: DateTime
  timetableRows: TimetableRow[]
  timetableAcceptanceDate: DateTime
  origin: TimetableRow
  destination: TimetableRow
}

export const toJSON = async (train: Train): Promise<TrainJSON> => ({
  ...train,
  departureDate: date2ISO(train.departureDate),
  timeTableRows: await Promise.all(train.timetableRows.map(timetableRowToJSON)),
  timetableAcceptanceDate: train.timetableAcceptanceDate.toJSON(),
})

export const fromJSON = async (json: TrainJSON): Promise<Train> => ({
  ...json,
  trainId: `${json.departureDate}/${json.trainNumber}`,
  departureDate: DateTime.fromISO(json.departureDate, {
    zone: 'Europe/Helsinki',
  }),
  timetableRows: await Promise.all(json.timeTableRows.map(timetableRowFromJSON)),
  timetableAcceptanceDate: DateTime.fromISO(json.timetableAcceptanceDate),
  origin: await timetableRowFromJSON(json.timeTableRows[0]),
  destination: await timetableRowFromJSON(json.timeTableRows[json.timeTableRows.length - 1]),
})

/**
 * Get single train
 * @param number Number of the train
 * @param date Departure date of the train. If value not given, fuzzy search will be used.
 */
export const retrieve = async (number: number, date?: DateTime): Promise<Train> => {
  const response = await API.get<[] | [TrainJSON]>(
    `/trains/${date !== undefined ? date2ISO(date) : 'latest'}/${number}`
  )

  if (response.data.length === 0) {
    throw new DigitrafficError(DigitrafficErrorCode.NOT_FOUND)
  } else {
    return fromJSON(response.data[0])
  }
}

/**
 * Get all trains of the given date
 * @param date Departure date
 */
export const list = async ({ departureDate }: { departureDate: DateTime }): Promise<Train[]> => {
  const response = await API.get<TrainJSON[]>(`/trains/${date2ISO(departureDate)}`)
  return Promise.all(response.data.map(fromJSON))
}

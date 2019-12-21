import {
  TimetableRow,
  TimetableRowJSON,
  toJSON as timetableRowToJSON,
  fromJSON as timetableFromJSON,
} from './TimetableRow'
import { TrainPropsCommon } from './Train'
import { date2ISO } from './utils'
import API from './API'
import { DigitrafficError, DigitrafficErrorCode } from './errors'
import { DateTime } from 'luxon'

export interface CompositionProps<T> extends TrainPropsCommon {
  journeySections: Array<{
    beginTimeTableRow: T
    endTimeTableRow: T
    locomotives: Array<{
      location: number
      locomotiveType: string
      powerType: string
    }>
    wagons: Array<{
      location: number
      salesNumber: number
      /**
       * Length of the wagon in centimeters
       */
      length: number
      playground?: boolean
      pet?: boolean
      catering?: boolean
      video?: boolean
      luggage?: boolean
      smoking?: boolean
      disabled?: boolean
      wagonType?: string
    }>
    /**
     * Total length of the train in meters
     */
    totalLength: number
    /**
     * Maximum allowed speed of the train in km/h
     */
    maximumSpeed: number
  }>
}

export type CompositionJSON = CompositionProps<TimetableRowJSON>
export type Composition = CompositionProps<TimetableRow>

export const toJSON = async (composition: Composition): Promise<CompositionJSON> => ({
  ...composition,
  journeySections: await Promise.all(
    composition.journeySections.map(async section => ({
      ...section,
      beginTimeTableRow: await timetableRowToJSON(section.beginTimeTableRow),
      endTimeTableRow: await timetableRowToJSON(section.endTimeTableRow),
    }))
  ),
})

export const fromJSON = async (json: CompositionJSON): Promise<Composition> => ({
  ...json,
  journeySections: await Promise.all(
    json.journeySections.map(async section => ({
      ...section,
      beginTimeTableRow: await timetableFromJSON(section.beginTimeTableRow),
      endTimeTableRow: await timetableFromJSON(section.endTimeTableRow),
    }))
  ),
})

/**
 * Get composition of single train
 * @param trainNumber Number of the train
 * @param departureDate Departure date of the train
 */
export const retrieve = async (
  trainNumber: number,
  departureDate: DateTime
): Promise<Composition> => {
  const response = await API.get<[] | [CompositionJSON]>(
    `/compositions/${date2ISO(departureDate)}/${trainNumber}`
  )

  if (response.data.length === 0) {
    throw new DigitrafficError(DigitrafficErrorCode.NOT_FOUND)
  } else {
    return fromJSON(response.data[0])
  }
}

/**
 * Get compositions of all trains in the given date
 * @param date Departure date
 */
export const list = async (query: { departureDate: DateTime }): Promise<Composition[]> => {
  const response = await API.get<CompositionJSON[]>(
    `/compositions/${date2ISO(query.departureDate)}`
  )
  return Promise.all(response.data.map(fromJSON))
}

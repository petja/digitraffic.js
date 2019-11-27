import {
  TimetableRow,
  TimetableRowJSON,
  toJSON as timetableRowToJSON,
  fromJSON as timetableFromJSON,
} from './TimetableRow'
import { TrainPropsCommon } from './Train'
import { date2ISO } from './utils/utils'
import API from './API'
import { DigitrafficError, DigitrafficErrorCode } from './errors'
import { DateTime } from 'luxon'

export interface CompositionProps<T> extends TrainPropsCommon {
  journeySections: {
    beginTimeTableRow: T
    endTimeTableRow: T
    locomotives: {
      location: number
      locomotiveType: string
      powerType: string
    }[]
    wagons: {
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
    }[]
    /**
     * Total length of the train in meters
     */
    totalLength: number
    /**
     * Maximum allowed speed of the train in km/h
     */
    maximumSpeed: number
  }[]
}

export type CompositionJSON = CompositionProps<TimetableRowJSON>
export type Composition = CompositionProps<TimetableRow>

export const toJSON = (composition: Composition): CompositionJSON => ({
  ...composition,
  journeySections: composition.journeySections.map(section => ({
    ...section,
    beginTimeTableRow: timetableRowToJSON(section.beginTimeTableRow),
    endTimeTableRow: timetableRowToJSON(section.endTimeTableRow),
  })),
})

export const fromJSON = (json: CompositionJSON): Composition => ({
  ...json,
  journeySections: json.journeySections.map(section => ({
    ...section,
    beginTimeTableRow: timetableFromJSON(section.beginTimeTableRow),
    endTimeTableRow: timetableFromJSON(section.endTimeTableRow),
  })),
})

/**
 * Get composition of single train
 * @param trainNumber Number of the train
 * @param departureDate Departure date of the train
 */
export const retrieve = async (trainNumber: number, departureDate: DateTime) => {
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
export const list = async (query: { departureDate: DateTime }) => {
  const response = await API.get<CompositionJSON[]>(
    `/compositions/${date2ISO(query.departureDate)}`
  )
  return response.data.map(fromJSON)
}

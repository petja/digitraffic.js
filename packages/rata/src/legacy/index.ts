import { Point } from '@turf/helpers'

interface TrainCommonFields {
  trainNumber: number
  /**
   * Departure date on the first station of the train. Formatted in ISO 8601.
   */
  departureDate: string
  version?: number
}

type TrainCategory =
  | 'Commuter'
  | 'Locomotive'
  | 'Shunting'
  | 'Long-distance'
  | 'Cargo'
  | 'On-track machines'
  | 'Test drive'

interface TrainCommonFields2 extends TrainCommonFields {
  operatorUICCode: number
  operatorShortCode: string
  trainType: string
  trainCategory: TrainCategory
}

type CountryCode = 'FI' | 'RU'

/**
 * Information from the train and its timetable
 * @see https://www.digitraffic.fi/rautatieliikenne/#junat
 */
export interface Train extends TrainCommonFields2 {
  commuterLineID?: string
  runningCurrently: boolean
  cancelled: boolean
  timetableType: 'REGULAR' | 'ADHOC'
  timetableAcceptanceDate: string
  deleted?: boolean
  timeTableRows: TrainTimetableRow[]
}

export interface TrainTimetableRow {
  trainStopping: boolean
  stationShortCode: string
  stationUICCode: number
  countryCode: CountryCode
  type: 'ARRIVAL' | 'DEPARTURE'
  commercialStop?: boolean
  commercialTrack?: string
  cancelled: boolean
  scheduledTime: Date
  liveEstimateTime?: Date
  estimateSource?: 'MIKU_USER' | 'LIIKE_USER' | 'LIIKE_AUTOMATIC' | 'COMBOCALC'
  unknownDelay?: boolean
  actualTime?: Date
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

/**
 * Composition of the train
 */
export interface TrainComposition extends TrainCommonFields2 {
  journeySections: {
    beginTimeTableRow: TrainTimetableRow
    endTimeTableRow: TrainTimetableRow
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

export interface TrainGPSLocation extends TrainCommonFields {
  timestamp: string
  location: Point
  speed: number
}

export interface TrackReservationMessage extends TrainCommonFields {
  id: number
  version: number
  timestamp: string
  trackSection: string
  nextTrackSection?: string
  previousTrackSection?: string
  station: string
  nextStation?: string
  previousStation?: string
  type: 'OCCUPY' | 'RELEASE'
}

export interface Station {
  passengerTraffic: boolean
  countryCode: CountryCode
  stationName: string
  stationShortCode: string
  stationUICCode: number
  latitude: number
  longitude: number
  type: 'STATION' | 'STOPPING_POINT' | 'TURNOUT_IN_THE_OPEN_LINE'
}

import fetch from 'node-fetch'
import axios from 'axios'

const dtAPI = axios.create({
  baseURL: 'https://rata.digitraffic.fi/api/v1',
})

/**
 * Get single train
 * @param number Number of the train
 * @param date Departure date of the train. If this value is undefin>ed, fuzzy search will be used.
 */
const getTrain = (number: number, date?: Date): Promise<Train> =>
  dtAPI.get(`/trains/${date ? date2ISO(date) : 'latest'}/${number}`)

/**
 * Get all trains of the given date
 * @param date Departure date
 */
const getTrainsOfDate = (date: Date): Promise<Train[]> => dtAPI.get(`/trains/${date2ISO(date)}`)

/**
 * Get all trains changed since given version. If version is undefined, return latest changes.
 * Please note that this method MIGHT return same train multiple times. Latest is the newest.
 * @param version Version number
 */
const getTrains = async function*(version?: number) {
  do {
    const trains: Train[] = (await dtAPI.get(`/trains`, { params: { version } })).data.slice(0, 20)
    const nextVersion = getMaxVersion(trains)

    for (const train of trains) {
      yield train
    }

    if (nextVersion) {
      console.log(`Next page ${nextVersion}`)
      version = nextVersion
    } else {
      return void 0
    }
  } while (true)
}

const getMaxVersion = (items: any[]): number =>
  items.reduce((version, item) => Math.max(version, item.version), 0)

const date2ISO = (date: Date) => date.toISOString().substr(0, 5)

  // MAIN
;(async function() {
  const trains = getTrains(261515341255)

  const iterator = trains[Symbol.asyncIterator]()

  for (let i = 0; i < 10; i++) {
    console.log(await iterator.next())
  }

  // for await (const train of trains) {
  //   console.log(`train ${train.trainNumber}`)
  // }
})()

import { AxiosResponse } from 'axios'

import API from './API'
import { DigitrafficError, DigitrafficErrorCode } from './errors'

export interface Station {
  stationName: string
  passengerTraffic: boolean
  type: 'STATION' | 'STOPPING_POINT' | 'TURNOUT_IN_THE_OPEN_LINE'
  stationShortCode: string
  stationUICCode: number
  countryCode: 'FI' | 'RU' | 'SE'
  longitude: number
  latitude: number
}

const ONE_HOUR = 3_600_000

let stationsPromise: Promise<AxiosResponse<Station[]>>
let lastFetch: Date

/**
 * Get all stations
 * List is automatically cached for 1 hour
 */
export const list = async () => {
  if (!stationsPromise || Date.now() - lastFetch.getTime() > ONE_HOUR) {
    stationsPromise = API.get<Station[]>(`/metadata/stations`)
    lastFetch = new Date()
  }

  return (await stationsPromise).data
}

/**
 * Get single station by its shortCode
 */
export const retrieve = async (shortCode: string) => {
  const stations = await list()

  const station = stations.find(
    station => station.stationShortCode.toUpperCase() === shortCode.toUpperCase()
  )

  if (station) {
    return station
  } else {
    throw new DigitrafficError(DigitrafficErrorCode.NOT_FOUND)
  }
}

import API from './API'
import { AxiosResponse } from 'axios'

export interface StationProps {
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

let stationsPromise: Promise<AxiosResponse<StationProps[]>>
let lastFetch: Date

/**
 * Get all stations
 * List is automatically cached for 1 hour
 */
export const list = async () => {
  if (!stationsPromise || Date.now() - lastFetch.getTime() > ONE_HOUR) {
    stationsPromise = API.get<StationProps[]>(`/metadata/stations`)
    lastFetch = new Date()
  }

  return (await stationsPromise).data
}

/**
 * Get single station by its shortCode
 */
export const retrieve = async (shortCode: string) =>
  (await list()).find(station => station.stationShortCode.toUpperCase() === shortCode.toUpperCase())

import API from './API'
import { date2ISO } from './utils'
import { DateTime } from 'luxon'
import { Point, BBox } from '@turf/helpers'

interface GPSLocationProps {
  trainNumber: number
  location: Point
  speed: number
}

export interface GPSLocationJSON extends GPSLocationProps {
  departureDate: string
  timestamp: string
}

export interface GPSLocation extends GPSLocationProps {
  departureDate: DateTime
  timestamp: DateTime
}

export const toJSON = async (gpsLocation: GPSLocation): Promise<GPSLocationJSON> => ({
  ...gpsLocation,
  departureDate: gpsLocation.departureDate.toISODate(),
  timestamp: gpsLocation.timestamp.toISO(),
})

export const fromJSON = async (json: GPSLocationJSON): Promise<GPSLocation> => ({
  ...json,
  departureDate: DateTime.fromISO(json.departureDate, { zone: 'Europe/Helsinki' }),
  timestamp: DateTime.fromISO(json.timestamp, { zone: 'Europe/Helsinki' }),
})

/**
 * Get latest GPS location for all trains which have moved within last 15 minutes
 */
export const listAllTrains = async (boundingBox?: BBox): Promise<GPSLocation[]> => {
  const response = await API.get<GPSLocationJSON[]>('/train-locations/latest', {
    params: { bbox: boundingBox?.slice(0, 4).join(',') },
  })

  return Promise.all(response.data.map(fromJSON))
}

/**
 * List all locations of single train
 */
export const listLocationsOfTrain = async (
  trainNumber: number,
  departureDate: DateTime
): Promise<GPSLocation[]> => {
  const response = await API.get<GPSLocationJSON[]>(
    `/train-locations/${date2ISO(departureDate)}/${trainNumber}`
  )

  return Promise.all(response.data.map(fromJSON))
}

import { point, featureCollection } from '@turf/helpers'

import { list as listStations, retrieve as retrieveStation, StationProps } from './Station'

/**
 * Get all stations in GeoJSON format
 * List is automatically cached for 1 hour
 */
export const list = async () =>
  featureCollection(
    (await listStations()).map(station => point([station.longitude, station.latitude], station))
  )

/**
 * Get single station by its shortCode in GeoJSON format
 */
export const retrieve = async (shortCode: string) => {
  const station = await retrieveStation(shortCode)
  if (station) return point([station.longitude, station.latitude], station)
}

export { StationProps }

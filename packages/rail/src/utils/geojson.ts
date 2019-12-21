import { point, featureCollection, Point, Feature, FeatureCollection } from '@turf/helpers'
import { getCoord } from '@turf/invariant'

import { TimetableRow } from '../TimetableRow'
import { Station, retrieve as retrieveStation } from '../Station'
import { GPSLocation } from '../GPSLocation'

interface TrainGPS {
  trainNumber: number
}

export const stationToGeoJSON = (station: Station): Feature<Point, Station> =>
  point([station.longitude, station.latitude], station)

export const stationsToGeoJSON = (stations: Station[]): FeatureCollection<Point, Station> =>
  featureCollection(stations.map(stationToGeoJSON))

export const timetableRowToGeoJSON = async (row: TimetableRow): Promise<Feature<Point, Station>> =>
  stationToGeoJSON(await retrieveStation(row.stationShortCode))

export const timetableRowsToGeoJSON = async (
  timetable: TimetableRow[]
): Promise<FeatureCollection<Point, Station>> =>
  featureCollection(
    await Promise.all(
      timetable.reduce((rows: Array<Promise<Feature<Point, Station>>>, row, index) => {
        if ((row.type === 'DEPARTURE' && index === 0) || (row.type === 'ARRIVAL' && index > 0)) {
          return [...rows, timetableRowToGeoJSON(row)]
        }

        return rows
      }, [])
    )
  )

export const gpsLocationToGeoJSON = (gps: GPSLocation): Feature<Point, Partial<GPSLocation>> =>
  point(getCoord(gps.location), {
    trainNumber: gps.trainNumber,
    departureDate: gps.departureDate,
    speed: gps.speed,
    timestamp: gps.timestamp,
  })

export const gpsLocationsToGeoJSON = (
  locations: GPSLocation[]
): FeatureCollection<Point, Partial<GPSLocation>> =>
  featureCollection(locations.map(gpsLocationToGeoJSON))

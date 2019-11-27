import { point, featureCollection, Point, Feature } from '@turf/helpers'
import { getCoord } from '@turf/invariant'

import { TimetableRow } from '../TimetableRow'
import { Station, retrieve as retrieveStation } from '../Station'
import { GPSLocation } from '../GPSLocation'

export const stationToGeoJSON = (station: Station) =>
  point([station.longitude, station.latitude], station)

export const stationsToGeoJSON = (stations: Station[]) =>
  featureCollection(stations.map(stationToGeoJSON))

export const timetableRowToGeoJSON = async (row: TimetableRow) =>
  stationToGeoJSON(await retrieveStation(row.stationShortCode))

export const timetableRowsToGeoJSON = async (timetable: TimetableRow[]) =>
  featureCollection(
    await Promise.all(
      timetable.reduce((rows: Promise<Feature<Point, Station>>[], row, index) => {
        if ((row.type === 'DEPARTURE' && index === 0) || (row.type === 'ARRIVAL' && index > 0)) {
          return [...rows, timetableRowToGeoJSON(row)]
        }

        return rows
      }, [])
    )
  )

export const gpsLocationToGeoJSON = (gps: GPSLocation) =>
  point(getCoord(gps.location), {
    trainNumber: gps.trainNumber,
    departureDate: gps.departureDate,
    speed: gps.speed,
    timestamp: gps.timestamp,
  })

export const gpsLocationsToGeoJSON = (locations: GPSLocation[]) =>
  featureCollection(locations.map(gpsLocationToGeoJSON))

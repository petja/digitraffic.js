import { DateTime } from 'luxon'

import { Station, retrieve } from './Station'

type CountryCode = 'FI' | 'RU'

interface TrainTrackingMessageProps {
  id: number
  version: number
  trainNumber: string
  trackSection: string
  nextTrackSection?: string
  previousTrackSection?: string
  type: 'OCCUPY' | 'RELEASE'
}

export interface TrainTrackingMessageJSON extends TrainTrackingMessageProps {
  departureDate: string
  timestamp: string
  station: string
  nextStation?: string
  previousStation?: string
}

export interface TrainTrackingMessage extends TrainTrackingMessageProps {
  departureDate: DateTime
  timestamp: DateTime
  station: Station
  nextStation?: Station
  previousStation?: Station
}

export const toJSON = async (row: TrainTrackingMessage): Promise<TrainTrackingMessageJSON> => ({
  ...row,
  departureDate: row.departureDate.toISO(),
  timestamp: row.timestamp.toISO(),
  station: row.station.stationShortCode,
  nextStation: row.nextStation && row.nextStation.stationShortCode,
  previousStation: row.previousStation && row.previousStation.stationShortCode,
})

export const fromJSON = async (json: TrainTrackingMessageJSON): Promise<TrainTrackingMessage> => ({
  ...json,
  departureDate: DateTime.fromISO(json.departureDate),
  timestamp: DateTime.fromISO(json.timestamp),
  station: await retrieve(json.station),
  nextStation: json.nextStation ? await retrieve(json.nextStation) : void 0,
  previousStation: json.previousStation ? await retrieve(json.previousStation) : void 0,
})

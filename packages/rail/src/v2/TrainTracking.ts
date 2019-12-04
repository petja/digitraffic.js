import { DateTime } from 'luxon'

type CountryCode = 'FI' | 'RU'

interface TrainTrackingMessageProps {
  id: number
  version: number
  trainNumber: string
  trackSection: string
  nextTrackSection?: string
  previousTrackSection?: string
  station: string
  nextStation?: string
  previousStation?: string
  type: 'OCCUPY' | 'RELEASE'
}

export interface TrainTrackingMessageJSON extends TrainTrackingMessageProps {
  departureDate: string
  timestamp: string
}

export interface TrainTrackingMessage extends TrainTrackingMessageProps {
  departureDate: DateTime
  timestamp: DateTime
}

export const toJSON = (row: TrainTrackingMessage): TrainTrackingMessageJSON => ({
  ...row,
  departureDate: row.departureDate.toISO(),
  timestamp: row.timestamp.toISO(),
})

export const fromJSON = (json: TrainTrackingMessageJSON): TrainTrackingMessage => ({
  ...json,
  departureDate: DateTime.fromISO(json.departureDate),
  timestamp: DateTime.fromISO(json.timestamp),
})
import { DateTime } from 'luxon'
import { MqttClient, connect as connectMQTT } from 'mqtt'
import { trains, compositions } from '@digitraffic/rata'

import { createWatcher } from './utils'

/**
 * Watch for changes on trains
 */
export const watchTrains = (
  query: {
    departureDate?: DateTime
    trainNumber?: number
    trainCategory?: trains.TrainCategory
    trainType?: string
    operator?: string
    commuterLine?: string
    runningCurrently?: boolean
    timetableType?: trains.TimeTableType
  },
  client: MqttClient
) =>
  createWatcher<trains.Train>(client, trains.fromJSON, [
    'trains',
    query.departureDate,
    query.trainNumber,
    query.trainCategory,
    query.trainType,
    query.operator,
    query.commuterLine,
    query.runningCurrently,
    query.timetableType,
  ])

export const watchTrainsByStation = (query: { stationShortCode: string }, client: MqttClient) =>
  createWatcher<trains.Train>(client, trains.fromJSON, [
    'trains-by-station',
    query.stationShortCode,
  ])

export const watchTrainLocations = (
  query: { departureDate?: DateTime; trainNumber?: number },
  client: MqttClient
) =>
  createWatcher<trains.Train>(client, trains.fromJSON, [
    'train-locations',
    query.departureDate,
    query.trainNumber,
  ])

export const watchTrackSections = (
  query: {
    departureDate?: DateTime
    trainNumber?: number
    type?: any
    station?: string
    previousStation?: string
    nextStation?: string
    previousTrackSection?: string
    nextTrackSection?: string
  },
  client: MqttClient
) =>
  createWatcher<trains.Train>(client, trains.fromJSON, [
    'train-tracking',
    query.departureDate,
    query.trainNumber,
    query.type,
    query.station,
    query.previousStation,
    query.nextStation,
    query.previousTrackSection,
    query.nextTrackSection,
  ])

export const watchRoutesets = (
  query: { departureDate?: DateTime; trainNumber?: number },
  client: MqttClient
) =>
  createWatcher<trains.Train>(client, trains.fromJSON, [
    'routesets',
    query.departureDate,
    query.trainNumber,
  ])

export const watchCompositions = (
  query: {
    departureDate?: DateTime
    trainNumber?: number
    trainCategory?: trains.TrainCategory
    trainType?: string
    operator?: string
  },
  client: MqttClient
) =>
  createWatcher<compositions.Composition>(client, compositions.fromJSON, [
    'compositions',
    query.departureDate,
    query.trainNumber,
    query.trainCategory,
    query.trainType,
    query.operator,
  ])

export const getMQTTClient = () =>
  new Promise<MqttClient>((resolve, reject) => {
    const client = connectMQTT('wss://rata.digitraffic.fi/mqtt')
    client.once('connect', () => resolve(client))
    client.once('error', err => reject(err))
  })

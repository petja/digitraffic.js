import mqtt from 'mqtt'

import { getISODate } from './utils'

export interface Train {
  cancelled: boolean
  commuterLineID: string
  deleted?: boolean
  departureDate: string
  timeTableRows: TimetableRow[]
  trainCategory: 'Cargo' | 'Commuter' | 'Long-distance' | 'Shunting' | 'On-track machines'
  trainNumber: number
  trainType: string
  version: number
}

export interface TimetableRow {
  trainId: string
  actualTime?: Date
  commercialTrack?: string
  liveEstimateTime?: Date
  scheduledTime: Date
  stationShortCode: string
  trainStopping: boolean
  type: 'ARRIVAL' | 'DEPARTURE'
  unknownDelay?: boolean
}

export const listenForChanges = (fn: (train: Train) => any) => {
  const mqttClient = mqtt.connect('wss://rata.digitraffic.fi/mqtt', { port: 443 })

  mqttClient.on('connect', function() {
    console.log('📡 Connected to live trains MQTT')
    mqttClient.subscribe('trains/#', function(err) {
      if (err) console.error(err)
    })
  })

  mqttClient.on('message', function(topic, message) {
    const train: Train = JSON.parse(message.toString())
    fn(train)
  })

  mqttClient.on('error', err => console.error('x', err))
}

//const x: EventListener

const apiRequest = (path: string, config?: RequestInit) =>
  fetch(`https://rata.digitraffic.fi/api/v1/${path}`, config).then(resp => resp.json())

export const getTrainsOfDate = (date = new Date()): Promise<Train[]> =>
  apiRequest(`/trains/${getISODate(date)}`)

export const getUpdates = (version?: string): Promise<Train[]> => apiRequest(`/`)

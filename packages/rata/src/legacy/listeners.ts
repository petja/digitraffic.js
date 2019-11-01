import mqtt, { MqttClient } from 'mqtt'

import { Train } from './digitraffic2'

let _mqttClient: MqttClient

const getClient = () =>
  new Promise<MqttClient>(resolve => {
    if (_mqttClient) {
      resolve(_mqttClient)
    } else {
      _mqttClient = mqtt.connect('wss://rata.digitraffic.fi/mqtt', { port: 443 })
      _mqttClient.once('connect', () => resolve(_mqttClient))
    }
  })

const subscribeTopic = async <T>(topic: string, onMessage: (message: T) => void) => {
  const client = await getClient()

  client.subscribe(topic)

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      const parsed = JSON.parse(message.toString()) as T
      onMessage(parsed)
    }
  })

  return {
    unsubscribe: () => {
      client.unsubscribe(topic)
    },
  }
}

interface TrainFilter {
  departureDate?: Date
  trainNumber?: number
  trainCategory?: TrainCategory
}

const listenForTrains = async (
  fn: (train: Train) => void,
  departureDate?: Date,
  trainNumber?: number
) => {
  await subscribeTopic<Train>('/trains', message => {})

  client.on('message', function(topic, message) {
    const train: Train = JSON.parse(message.toString())
    fn(train)
  })

  client.on('error', err => console.error('x', err))
}

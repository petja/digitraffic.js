import { DateTime } from 'luxon'

import * as digitraffic from '@digitraffic/rail'
import { MqttClient } from 'mqtt'
import topicMatch from 'mqtt-match'

export const createWatcher = <T>(
  client: MqttClient,
  fromJSON: (data: any) => T,
  fields: (string | number | boolean | DateTime | undefined)[]
) => {
  const listeners: ((message: T) => any)[] = []

  const topic = fields
    .map((field, index) => {
      if (field === void 0) {
        return index < fields.length - 1 ? '+' : '#'
      } else if (
        typeof field === 'number' ||
        typeof field === 'string' ||
        typeof field === 'boolean'
      ) {
        return field.toString()
      } else if (field.isValid) {
        return field.setZone('Europe/Helsinki').toISODate()
      }

      throw new digitraffic.errors.DigitrafficError(
        digitraffic.errors.DigitrafficErrorCode.INVALID_MQTT_TOPIC
      )
    })
    .join('/')

  console.log(topic)

  client.subscribe(topic)

  client.on('message', (inTopic, buffer) => {
    if (topicMatch(topic, inTopic)) {
      const message = fromJSON(JSON.parse(buffer.toString()))
      listeners.forEach(listener => listener(message))
    }
  })

  return {
    onMessage(listener: (message: T) => any) {
      listeners.push(listener)
    },
    unsubscribe() {
      client.unsubscribe(topic)
    },
  }
}

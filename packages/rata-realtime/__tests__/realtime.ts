import { getMQTTClient, watchTrains } from '../src/index'
import * as rata from '@digitraffic/rata'
import { DateTime } from 'luxon'
import { MqttClient } from 'mqtt'

let client: MqttClient

beforeEach(async () => {
  client = await getMQTTClient()
})

afterEach(async () => {
  client.end()
})

describe('listen for trains', () => {
  const today = DateTime.local().setZone('Europe/Helsinki')

  it(`should contain at least trainTypes IC, HL and T when listening all trains`, async done => {
    const trainTypes: string[] = []

    watchTrains({}, client).onMessage(train => {
      trainTypes.push(train.trainType)

      if (trainTypes.includes('IC') && trainTypes.includes('HL') && trainTypes.includes('T')) {
        done()
      }
    })
  }, 60000)

  it(`should only return trains where departureDate=${today.toISODate()}`, async done => {
    const messages: rata.trains.Train[] = []

    watchTrains({ departureDate: today }, client).onMessage(train => {
      messages.push(train)

      if (messages.length >= 10) {
        messages.forEach(train => {
          expect(train.departureDate.toISODate()).toBe(today.toISODate())
        })

        done()
      }
    })
  }, 60000)

  it(`should only return trains where trainType=HL and runningCurrently=true`, async done => {
    const messages: rata.trains.Train[] = []

    watchTrains({ trainType: 'HL', runningCurrently: true }, client).onMessage(train => {
      messages.push(train)

      if (messages.length >= 10) {
        messages.forEach(train => {
          expect(train.trainType).toBe('HL')
          expect(train.runningCurrently).toBe(true)
        })

        done()
      }
    })
  }, 60000)
})

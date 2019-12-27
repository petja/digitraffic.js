import { DateTime } from 'luxon'

import { mock } from '../src/API'
import { retrieve as retrieveTrain, list as listTrains } from '../src/Train'

const expectToBeNullOrLuxon = (date?: DateTime) => {
  if (date === undefined) {
    expect(date).toBeUndefined()
  } else {
    expect(date).toHaveProperty('toISO')
  }
}

describe('single train', () => {
  it('should return single train', async () => {
    mock.onGet().reply(200, require('./mocks/single_train.json'))

    const train = await retrieveTrain(1, DateTime.fromISO('2019-10-31T22:03:00.000Z'))

    expect(train.trainNumber).toBe(8533)
    expect(train.departureDate.toISODate()).toBe('2019-11-01')
    expect(train.timetableRows).toHaveLength(22)
  })

  it('should have valid fields for timetable rows', async () => {
    mock.onGet().reply(200, require('./mocks/single_train.json'))

    const train = await retrieveTrain(1, DateTime.fromISO('2019-10-31T22:03:00.000Z'))

    train.timetableRows.forEach(row => {
      expect(typeof row.station).toBe('string')
      expect(row.ARRIVAL || row.DEPARTURE).toBeDefined()
    })
  })
})

describe('trains of the day', () => {
  it('should return multiple trains', async () => {
    mock.onGet().reply(200, require('./mocks/trains_of_the_day.json'))

    const trains = await listTrains({
      departureDate: DateTime.fromISO('2019-11-01T12:34:56+02:00'),
    })

    expect(Array.isArray(trains)).toBe(true)

    trains.forEach(train => {
      expect(typeof train.trainNumber).toBe('number')
      expect(train.departureDate.toISODate()).toBe('2019-11-01')
      expect(Array.isArray(train.timetableRows)).toBe(true)
    })
  })
})

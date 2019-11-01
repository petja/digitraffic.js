import { Train } from './index'

const train: Train = {
  trainNumber: 64027,
  departureDate: '2019-09-10',
  operatorUICCode: 10,
  operatorShortCode: 'vr',
  trainType: 'W',
  trainCategory: 'Shunting',
  commuterLineID: '',
  runningCurrently: false,
  cancelled: false,
  version: 261513796437,
  timetableType: 'REGULAR',
  timetableAcceptanceDate: '2019-07-05T12:06:42.000Z',
  timeTableRows: [
    {
      stationShortCode: 'HKI',
      stationUICCode: 1,
      countryCode: 'FI',
      type: 'DEPARTURE',
      trainStopping: true,
      commercialStop: true,
      commercialTrack: '12',
      cancelled: false,
      scheduledTime: '2019-09-10T14:16:00.000Z',
      actualTime: '2019-09-10T14:15:46.000Z',
      differenceInMinutes: 0,
      causes: []
    },
    {
      stationShortCode: 'PSL',
      stationUICCode: 10,
      countryCode: 'FI',
      type: 'ARRIVAL',
      trainStopping: false,
      commercialTrack: '6',
      cancelled: false,
      scheduledTime: '2019-09-10T14:21:00.000Z',
      actualTime: '2019-09-10T14:21:14.000Z',
      differenceInMinutes: 0,
      causes: []
    },
    {
      stationShortCode: 'PSL',
      stationUICCode: 10,
      countryCode: 'FI',
      type: 'DEPARTURE',
      trainStopping: false,
      commercialTrack: '6',
      cancelled: false,
      scheduledTime: '2019-09-10T14:21:00.000Z',
      actualTime: '2019-09-10T14:21:20.000Z',
      differenceInMinutes: 0,
      causes: []
    },
    {
      stationShortCode: 'ILR',
      stationUICCode: 1030,
      countryCode: 'FI',
      type: 'ARRIVAL',
      trainStopping: true,
      commercialStop: true,
      commercialTrack: '774',
      cancelled: false,
      scheduledTime: '2019-09-10T14:31:00.000Z',
      actualTime: '2019-09-10T14:25:54.000Z',
      differenceInMinutes: -5,
      causes: []
    }
  ]
}

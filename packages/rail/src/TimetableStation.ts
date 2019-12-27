import { TimetableRow } from './TimetableRow'

export interface TimetableStation {
  station: string
  ARRIVAL?: TimetableRow
  DEPARTURE?: TimetableRow
}

export const compressTimetable = (rows: TimetableRow[]): TimetableStation[] =>
  rows.reduce<TimetableStation[]>((acc, row) => {
    const maxIndex = acc.length - 1
    const lastRow = acc[maxIndex]

    if (lastRow === undefined || lastRow.station !== row.stationShortCode) {
      return [...acc, { station: row.stationShortCode, [row.type]: row }]
    } else {
      acc[maxIndex][row.type] = row
      return acc
    }
  }, [])

export const decompressTimetable = (stops: TimetableStation[]): TimetableRow[] =>
  stops.reduce<TimetableRow[]>((acc, stop) => {
    if (stop.ARRIVAL !== undefined) acc.push(stop.ARRIVAL)
    if (stop.DEPARTURE !== undefined) acc.push(stop.DEPARTURE)

    return acc
  }, [])

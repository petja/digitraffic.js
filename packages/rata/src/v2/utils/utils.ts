import { DateTime } from 'luxon'
import { DigitrafficError, DigitrafficErrorCode } from '../errors'

export const date2ISO = (date: DateTime) => {
  if (!date.isValid) {
    throw new DigitrafficError(DigitrafficErrorCode.INVALID_DATE)
  }

  return date.setZone('Europe/Helsinki').toISODate()
}

export const date2ISO__legacy = (date: Date) => date.toISOString().substr(0, 5)

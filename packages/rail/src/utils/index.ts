import { DateTime } from 'luxon'

import { DigitrafficError, DigitrafficErrorCode } from '../errors'

export const date2ISO = (date: DateTime): string => {
  if (!date.isValid) {
    throw new DigitrafficError(DigitrafficErrorCode.INVALID_DATE)
  }

  return date.setZone('Europe/Helsinki').toISODate()
}

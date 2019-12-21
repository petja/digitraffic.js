/* eslint-disable import/no-duplicates */

import * as utils from './utils'
import './utils/geojson'

import { Composition } from './Composition'
import * as compositions from './Composition'

import { Station } from './Station'
import * as stations from './Station'

import { Train } from './Train'
import * as trains from './Train'

import { TrainTrackingMessage } from './TrainTracking'
import * as trainTracking from './TrainTracking'

import { DigitrafficError, DigitrafficErrorCode } from './errors'
import * as errors from './errors'

export {
  compositions,
  stations,
  trains,
  trainTracking,
  errors,
  utils,
  Composition,
  Station,
  Train,
  TrainTrackingMessage,
  DigitrafficError,
  DigitrafficErrorCode,
}

export class DigitrafficError extends Error {
  code: DigitrafficErrorCode

  constructor (code: DigitrafficErrorCode) {
    super()
    this.code = code
  }
}

export enum DigitrafficErrorCode {
  NOT_FOUND,
  INVALID_DATE,
  INVALID_MQTT_TOPIC,
}

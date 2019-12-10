import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const API = axios.create({
  baseURL: 'https://rata.digitraffic.fi/api/v1',
})

export const mock = new MockAdapter(API)

export default API

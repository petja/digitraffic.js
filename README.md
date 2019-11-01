# Digitraffic.js

**Digitraffic.js** helps developers to build apps upon information about Finnish railway network and roads in rapid fashion.

Thanks to strongly-typed code, you can enjoy benefits of Intellisense and type-checking.

## Examples

### Trains

Get train number `1` from yesterday

```typescript
import * as rata from '@digitraffic/rata'
import luxon from 'luxon'

const yesterday = luxon.local().minus({ days: 1 })

const train = await rata.trains.retrieve(1, yesterday)
```

Listen GPS locations of commuter trains in realtime

```typescript
import { watchTrains } from '@digitraffic/rata-realtime'

watchTrains({ trainCategory: 'Commuter' }).onMessage(location => {
  console.log(
    `Train ${location.commuterLineID} ${location.trainNumber} is at ${location.lat},${location.lon}`
  )
})
```

### Road

TODO

## Copyright

© 2019 Petja Touru

Data is provided by Traffic Management Finland Oy and is licensed with [Creative Commons 4.0 BY](https://creativecommons.org/licenses/by/4.0/). You are obligated to produce this copyright notice whenever using the library. More information [here](https://www.digitraffic.fi/kayttoehdot/) (in Finnish).

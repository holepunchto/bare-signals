# bare-signals

Native signal handling for JavaScript.

```
npm i bare-signals
```

## Usage

```js
const Signal = require('bare-signals')

const sigint = new Signal('SIGINT')

sigint.on('signal', () => console.log('SIGINT caught')).start()
```

## License

Apache-2.0

<!-- bare-refgen:api start -->

## API

### Signal

#### `new Signal(signum: number | string)`

Create a `Signal` for `signum`, given as a signal number or name such as `'SIGINT'`. Throws if `signum` is a string that names an unknown signal.

**Parameters**

| Parameter | Type               | Default | Description                                                                  |
| --------- | ------------------ | ------- | ---------------------------------------------------------------------------- |
| `signum`  | `number \| string` | —       | The signal to handle, given as a signal number or a name such as `'SIGINT'`. |

**Throws**

- `UNKNOWN_SIGNAL` — `signum` is a string that does not name a known signal.

#### `close(): Promise<void>`

Close the signal, releasing its underlying handle. Returns a promise that resolves once the `close` event has fired.

#### `Signal.ref(): this`

Ref the signal, keeping the event loop alive while it is active.

#### `Signal.constants: Record<string, number>`

The map of known signal names to signal numbers.

#### `start(): this`

Start listening for the signal, emitting `signal` when it is received. Throws if the signal has been closed.

**Throws**

- `SIGNAL_CLOSED` — the signal has been closed.

#### `stop(): this`

Stop listening for the signal.

#### `Signal.unref(): this`

Unref the signal, allowing the event loop to exit even while it is active.

### SignalEmitter

#### `SignalEmitter.ref(): this`

Ref all currently tracked signals, keeping the event loop alive.

#### `SignalEmitter.unref(): this`

Unref all currently tracked signals, allowing the event loop to exit.

### Classes

#### `SignalError`

```ts
class SignalError {
  code: string
}
```

<!-- bare-refgen:api end -->

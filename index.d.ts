import EventEmitter from 'bare-events'

/** An `EventEmitter` that lazily starts and stops a `Signal` for each named signal as listeners are added and removed, emitting the signal name and number. */
interface SignalEmitter extends EventEmitter<{ [signal: string]: [string, number] }> {
  /** Ref all currently tracked signals, keeping the event loop alive. */
  ref(): this
  /** Unref all currently tracked signals, allowing the event loop to exit. */
  unref(): this
}

declare class SignalEmitter {}

/** An error thrown by `bare-signals`, such as for an unknown signal name or an operation on a closed signal. */
declare class SignalError extends Error {
  /** The error code, such as `UNKNOWN_SIGNAL` or `SIGNAL_CLOSED`. */
  readonly code: string
}

interface Signal extends EventEmitter<{ close: []; signal: [signum: number] }> {
  /** Start listening for the signal, emitting `signal` when it is received. Throws if the signal has been closed. */
  start(): this
  /** Stop listening for the signal. */
  stop(): this
  /** Ref the signal, keeping the event loop alive while it is active. */
  ref(): this
  /** Unref the signal, allowing the event loop to exit even while it is active. */
  unref(): this
  /** Close the signal, releasing its underlying handle. Returns a promise that resolves once the `close` event has fired. */
  close(): Promise<void>
}

declare class Signal {
  /** Create a `Signal` for `signum`, given as a signal number or name such as `'SIGINT'`. Throws if `signum` is a string that names an unknown signal. */
  constructor(signum: number | string)
}

/**
 * A native OS signal that can be listened for, started, stopped, and closed.
 * @param signum - The signal to handle, given as a signal number or a name such as `'SIGINT'`.
 * @throws {UNKNOWN_SIGNAL} `signum` is a string that does not name a known signal.
 */
declare namespace Signal {
  export { SignalEmitter as Emitter, SignalError as errors }

  /** The map of known signal names to signal numbers. */
  export const constants: Record<string, number>
}

export = Signal

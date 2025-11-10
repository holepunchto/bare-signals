import EventEmitter from 'bare-events'
import os from 'bare-os'

interface SignalEmitter
  extends EventEmitter<{ [signal: string]: [string, number] }> {
  ref(): this
  unref(): this
}

declare class SignalEmitter {}

declare class SignalError extends Error {
  readonly code: string
}

interface Signal extends EventEmitter<{ close: []; signal: [signum: number] }> {
  start(): this
  stop(): this
  ref(): this
  unref(): this
  close(): Promise<void>
}

declare class Signal {
  static send(signum: number | string, pid?: number): void

  constructor(signum: number | string)
}

declare namespace Signal {
  export { SignalEmitter as Emitter, SignalError as errors }

  export const constants: typeof os.constants.signals
}

export = Signal

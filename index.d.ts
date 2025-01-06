import EventEmitter from 'bare-events'

declare class Signal extends EventEmitter<{ close: []; signal: [number] }> {
  static send(signum: number | string, pid?: number): void

  constructor(signum: number | string)

  close(): void
  ref(): void
  start(): void
  stop(): void
  unref(): void
}

declare class SignalEmitter extends EventEmitter<{ [name: string]: [] }> {
  ref(): void
  unref(): void
}

declare class SignalError extends Error {
  static UNKNOWN_SIGNAL(msg: string): SignalError
}

declare namespace Signal {
  export { SignalEmitter as Emitter, SignalError as errors }

  export const constants: Record<string, number>
}

export = Signal

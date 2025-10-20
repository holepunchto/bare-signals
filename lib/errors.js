module.exports = class SignalError extends Error {
  constructor(msg, fn = SignalError, code = fn.name) {
    super(`${code}: ${msg}`)
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, fn)
    }
  }

  get name() {
    return 'SignalError'
  }

  static UNKNOWN_SIGNAL(msg) {
    return new SignalError(msg, SignalError.UNKNOWN_SIGNAL)
  }

  static SIGNAL_CLOSED(msg) {
    return new SignalError(msg, SignalError.SIGNAL_CLOSED)
  }
}

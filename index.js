const EventEmitter = require('events')
const os = require('os')
const binding = require('./binding')
const errors = require('./lib/errors')

module.exports = class Signal extends EventEmitter {
  constructor (signum) {
    super()

    if (typeof signum === 'string') {
      if (signum in signals === false) {
        throw errors.UNKNOWN_SIGNAL('Unknown signal: ' + signum)
      }

      signum = signals[signum]
    }

    this._signum = signum
    this._handle = binding.init(this, this._onsignal, this._onclose)
  }

  _onsignal () {
    this.emit('signal', this._signum)
  }

  _onclose () {
    this.emit('close')
  }

  start () {
    binding.start(this._handle, this._signum)
  }

  stop () {
    binding.stop(this._handle)
  }

  close () {
    binding.close(this._handle)
  }

  static send (signum, pid = process.pid) {
    os.kill(pid, signum)
  }
}

const signals = exports.constants = os.constants.signals

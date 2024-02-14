/* global Bare */
const EventEmitter = require('bare-events')
const os = require('bare-os')
const binding = require('./binding')
const errors = require('./lib/errors')

const Signal = module.exports = exports = class Signal extends EventEmitter {
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
    this._closing = null

    Signal._signals.add(this)
  }

  _onsignal () {
    this.emit('signal', this._signum)
  }

  _onclose () {
    this._handle = null

    this.emit('close')
  }

  start () {
    binding.start(this._handle, this._signum)
  }

  stop () {
    binding.stop(this._handle)
  }

  ref () {
    binding.ref(this._handle)
  }

  unref () {
    binding.unref(this._handle)
  }

  close () {
    if (this._closing) return this._closing
    this._closing = EventEmitter.once(this, 'close')

    binding.close(this._handle)

    Signal._signals.delete(this)

    return this._closing
  }

  static _signals = new Set()

  static send (signum, pid = os.pid()) {
    os.kill(pid, signum)
  }
}

const signals = exports.constants = os.constants.signals

const wraps = new Map()

function isSignal (event) {
  return typeof event === 'string' && signals[event] !== undefined
}

function listenIfSignal (signum) {
  if (isSignal(signum) && !wraps.has(signum)) {
    const wrap = new Signal(signum)
    wrap.unref()

    wrap.on('signal', Bare.emit.bind(Bare, signum, signum))
    wrap.start()

    wraps.set(signum, wrap)
  }
}

function unlistenIfSignal (signum) {
  const wrap = wraps.get(signum)
  if (wrap !== undefined && Bare.listenerCount(signum) === 0) {
    wrap.close()
    wraps.delete(signum)
  }
}

Bare
  .on('exit', () => {
    for (const signal of Signal._signals) {
      signal.close()
    }
  })

Bare
  .on('newListener', listenIfSignal)

Bare
  .on('removeListener', unlistenIfSignal)

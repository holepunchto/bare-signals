const EventEmitter = require('events')
const binding = require('./binding')

module.exports = exports = class Signal extends EventEmitter {
  constructor (signum) {
    super()

    if (typeof signum === 'string' && signum in signals) {
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
}

exports.send = function send (signum, pid = process.pid) {
  if (typeof signum === 'string' && signum in signals) {
    signum = signals[signum]
  }

  binding.send(signum, pid)
}

const signals = exports.constants = {
  SIGHUP: binding.SIGHUP,
  SIGINT: binding.SIGINT,
  SIGQUIT: binding.SIGQUIT,
  SIGILL: binding.SIGILL,
  SIGTRAP: binding.SIGTRAP,
  SIGABRT: binding.SIGABRT,
  SIGIOT: binding.SIGIOT,
  SIGBUS: binding.SIGBUS,
  SIGFPE: binding.SIGFPE,
  SIGKILL: binding.SIGKILL,
  SIGUSR1: binding.SIGUSR1,
  SIGSEGV: binding.SIGSEGV,
  SIGUSR2: binding.SIGUSR2,
  SIGPIPE: binding.SIGPIPE,
  SIGALRM: binding.SIGALRM,
  SIGTERM: binding.SIGTERM,
  SIGCHLD: binding.SIGCHLD,
  SIGSTKFLT: binding.SIGSTKFLT,
  SIGCONT: binding.SIGCONT,
  SIGSTOP: binding.SIGSTOP,
  SIGTSTP: binding.SIGTSTP,
  SIGBREAK: binding.SIGBREAK,
  SIGTTIN: binding.SIGTTIN,
  SIGTTOU: binding.SIGTTOU,
  SIGURG: binding.SIGURG,
  SIGXCPU: binding.SIGXCPU,
  SIGXFSZ: binding.SIGXFSZ,
  SIGVTALRM: binding.SIGVTALRM,
  SIGPROF: binding.SIGPROF,
  SIGWINCH: binding.SIGWINCH,
  SIGIO: binding.SIGIO,
  SIGPOLL: binding.SIGPOLL,
  SIGLOST: binding.SIGLOST,
  SIGPWR: binding.SIGPWR,
  SIGINFO: binding.SIGINFO,
  SIGSYS: binding.SIGSYS,
  SIGUNUSED: binding.SIGUNUSED
}

const binding = require('./binding')

module.exports = exports = require('./lib/signal')

exports.Emitter = require('./lib/emitter')

exports.constants = binding.signals
exports.errors = require('./lib/errors')

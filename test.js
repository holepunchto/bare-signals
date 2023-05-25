const Signal = require('.')

const signal = new Signal('SIGINT')

console.log(signal)

signal
  .on('signal', () => {
    console.log('signal')
    signal.close()
  })
  .on('close', () => {
    console.log('closed')
  })
  .start()

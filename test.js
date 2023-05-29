const test = require('brittle')
const Signal = require('.')

test('catch SIGINT', (t) => {
  t.plan(2)

  const signal = new Signal('SIGINT')

  signal
    .on('signal', () => {
      t.pass('caught')
      signal.close()
    })
    .on('close', () => {
      t.pass('signal closed')
    })
    .start()

  Signal.send('SIGINT')
})

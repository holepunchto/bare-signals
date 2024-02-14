/* global Bare */
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

test('listen SIGINT', async (t) => {
  t.plan(1)
  const signum = 'SIGINT'

  function onsig () {
    Bare.removeListener(signum, onsig)
    t.pass('listened')
  }

  Bare.prependListener(signum, onsig)

  Bare.emit(signum)
})

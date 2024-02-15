/* global Bare */
const test = require('brittle')
const Signal = require('.')

const isWindows = Bare.platform === 'win32'

test('listen for SIGINT', async (t) => {
  const signal = new Signal('SIGINT')

  await t.execution(() => signal.start())

  signal.close()
})

test('catch SIGINT', { skip: isWindows }, (t) => {
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

const test = require('brittle')
const Signal = require('.')

const isWindows = Bare.platform === 'win32'

test('listen for SIGINT', async (t) => {
  const signal = new Signal('SIGINT')

  await t.execution(() => signal.start())

  signal.close()
})

test('listen for unknown signal', async (t) => {
  await t.exception(() => new Signal('foo'), /Unknown signal 'foo'/)
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

test('emitter with SIGINT', { skip: isWindows }, (t) => {
  t.plan(1)

  const emitter = new Signal.Emitter()

  emitter.once('SIGINT', (...args) => {
    t.alike(args, ['SIGINT', 2])
  })

  Signal.send('SIGINT')
})

test('emitter with unknown signal', async (t) => {
  const emitter = new Signal.Emitter()

  await t.exception(() => emitter.once('foo', () => {}), /Unknown signal 'foo'/)
})

test('stop after close', async (t) => {
  const signal = new Signal('SIGINT')

  signal.close()
  signal.stop()
})

test('start after close', async (t) => {
  const signal = new Signal('SIGINT')

  signal.close()
  await t.exception(() => signal.start())
})

test('ref after close', async (t) => {
  const signal = new Signal('SIGINT')

  signal.close()
  signal.ref()
})

test('unref after close', async (t) => {
  const signal = new Signal('SIGINT')

  signal.close()
  signal.unref()
})

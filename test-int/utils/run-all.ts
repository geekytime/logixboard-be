import { createServer } from '../../src/server'
import glob from 'glob'
import mongo from './mongo-test'
import path from 'path'
import process from 'process'
import tape from 'tape'

const port = 3001
const app = createServer()
const server = app.listen(port, async () => {
  try {
    await importTestModules()

    //@ts-ignore
    tape.run()
  } catch (error) {
    console.error('an error occurred importing or running tests')
    console.error(error)
    cleanup(1)
  }
})

const cleanup = (exitCode: number) => {
  server.close()
  mongo.getClientInstance().close()
  process.exit(exitCode)
}

tape.onFailure(() => {
  console.error('one or more tape tests failed')
  cleanup(1)
})
tape.onFinish(() => {
  cleanup(0)
})

process.on('uncaughtException', error => {
  console.error(error)
  cleanup(1)
})

const importTestModules = async () => {
  const testGlob = path.join(__dirname, '../**/*.test.ts')
  const matches = glob.sync(testGlob)
  const modules = matches.map(match => {
    return import(match)
  })
  return Promise.all(modules)
}

import { createServer } from './server'

const port = 3000

const server = createServer()
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

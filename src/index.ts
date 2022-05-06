const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const port = 3000

app.post('/shipment', async (req: any, res: any) => {
  res.status(200).send()
})

app.post('/organization', (req: any, res: any) => {
  res.status(200).send()
})

app.get('/shipments/:shipmentId', (req: any, res: any) => {
  res.status(200).send()
})

app.get('/organizations/:organizationId', (req: any, res: any) => {
  res.status(200).send()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

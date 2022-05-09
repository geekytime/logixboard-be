import mongo from './utils/mongo-test'
import test from 'tape'
import axios from 'axios'
import shipmentsModel from '../src/models/shipments-model'
import { sendAllMessages } from './utils/send-all-messages'

const baseUrl = 'http://localhost:3001/shipment-weights'

test('shipments-weights-messages - total shipment weight in ounces', async t => {
  await mongo.dropCollections()
  await sendAllMessages()

  const resOz = await axios.get(`${baseUrl}?desiredUnits=OUNCES`)
  t.equals(resOz.status, 200)
  t.equals(resOz.data.weight, 801809.0415, 'total weight')

  const resKg = await axios.get(`${baseUrl}?desiredUnits=KILOGRAMS`)
  t.equals(resKg.status, 200)
  t.equals(resKg.data.weight, 22730.8854, 'KILOGRAMS')

  const resLb = await axios.get(`${baseUrl}?desiredUnits=POUNDS`)
  t.equals(resLb.status, 200)
  t.equals(resLb.data.weight, 50113.0651, 'POUNDS')
})

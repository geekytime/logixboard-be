import axios from 'axios'
import mongo from './utils/mongo-test'
import test from 'tape'
import { ObjectId } from 'mongodb'
import { postAllowErrors } from './utils/post-allow-errors'

const shipmentUrl = 'http://localhost:3001/shipment'

test('shipment-ingress - insert and udpate', async t => {
  await mongo.dropCollections()

  const dataBase = {
    type: 'SHIPMENT',
    referenceId: 'S000000001',
    organizations: [],
    estimatedTimeArrival: '2020-03-13T00:00:00',
    transportPacks: {
      nodes: []
    }
  }

  const responseBase = await axios.post(shipmentUrl, dataBase)

  t.equals(201, responseBase.status, 'should return a 201')

  t.true(ObjectId.isValid(responseBase.data._id), 'is a valid mongoId')

  const dataEta = { ...dataBase, estimatedTimeArrival: '2003-08-16:T06:00:00' }

  const responseEta = await axios.post(shipmentUrl, dataEta)

  // We could probably discuss making this a 200 or a 202...
  t.equals(responseEta.status, 201, 'should still return a 201')
  t.equals(
    responseEta.data._id,
    responseBase.data._id,
    'should use existing mongoId'
  )
})

test('shipment-ingress - type is required', async t => {
  const res = await postAllowErrors(shipmentUrl, {
    referenceId: 'S000000001'
  })
  t.equals(res.status, 400, 'should fail')
  t.equals(
    res.data.errors[0].param,
    'type',
    'errors should include the field name'
  )
})

test('shipment-ingress - referenceId is required', async t => {
  const res = await postAllowErrors(shipmentUrl, {
    type: 'SHIPMENT'
  })
  t.equals(res.status, 400, 'should fail')
  t.equals(
    res.data.errors[0].param,
    'referenceId',
    'errors should include the field name'
  )
})

test('shipment-ingress - organizations should sanitize to empty default', async t => {
  await mongo.dropCollections()

  const res = await axios.post(shipmentUrl, {
    type: 'SHIPMENT',
    referenceId: 'S0000001'
  })
  t.equals(res.status, 201, 'should succeed')
  t.true(ObjectId.isValid(res.data._id), 'should be valid mongoId')

  const doc = await mongo.findById('shipments', res.data._id)
  t.deepEquals(doc?.organizationIds, [], 'should be empty array')
})

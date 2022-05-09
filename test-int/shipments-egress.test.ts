import mongo from './utils/mongo-test'
import test from 'tape'
import axios from 'axios'
import shipmentsModel from '../src/models/shipments-model'

const baseUrl = 'http://localhost:3001/shipments'

test('shipments-egress - shipment records can be found by ID', async t => {
  await mongo.dropCollections()

  const referenceId = 'S00000001'

  const shipment = {
    referenceId,
    organizationCodes: []
  }

  const _id = await shipmentsModel.upsertOne(shipment)

  const response = await axios.get(`${baseUrl}/${_id}`)
  t.equals(response.status, 200)

  const { data } = response
  t.equals(data.referenceId, referenceId, 'should be the same referenceId')
  t.deepEquals(data.organizationIds, [], 'orgs should be empty')
  t.deepEquals(
    data.transportPacks,
    { nodes: [] },
    'transport packs should have empty default nodes'
  )
})

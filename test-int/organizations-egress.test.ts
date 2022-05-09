import mongo from './utils/mongo-test'
import test from 'tape'
import axios from 'axios'
import organizationsModel from '../src/models/organizations-model'

const baseUrl = 'http://localhost:3001/organizations'

test('organizations-egress - find by id', async t => {
  await mongo.dropCollections()

  const externalId = '11112-111111-11111111'

  const _id = await organizationsModel.upsertOne({
    externalId,
    code: 'FOO'
  })

  const response = await axios.get(`${baseUrl}/${_id}`)
  t.equals(response.status, 200)

  const { data } = response
  t.equals(data.code, 'FOO', 'should be the FOO org')
  t.equals(data.externalId, externalId, 'externalId fields should match')
})

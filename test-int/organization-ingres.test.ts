import axios from 'axios'
import mongo from './utils/mongo-test'
import test from 'tape'
import { ObjectId } from 'mongodb'
import { postAllowErrors } from './utils/post-allow-errors'

const orgUrl = 'http://localhost:3001/organization'

test('organization-ingress - insert and udpate', async t => {
  await mongo.dropCollections()

  const id = '1111112-11111-1111-1111-1111111111'

  const responseFoo = await axios.post(orgUrl, {
    type: 'ORGANIZATION',
    id,
    code: 'FOO'
  })

  t.equals(201, responseFoo.status, 'should return a 201')

  t.true(ObjectId.isValid(responseFoo.data._id), 'is a valid mongoId')

  const responseBar = await axios.post(orgUrl, {
    type: 'ORGANIZATION',
    id,
    code: 'BAR'
  })

  // We could probably discuss making this a 200 or a 202...
  t.equals(responseFoo.status, 201, 'should still return a 201')
  t.equals(
    responseBar.data._id,
    responseFoo.data._id,
    'should use existing mongoId'
  )
})

test('organization-ingress - type is required', async t => {
  const res = await postAllowErrors(orgUrl, {
    id: '1111111-2222-1111-1111-1111111111',
    code: 'FOO'
  })
  t.equals(res.status, 400, 'no type should return a 400')
  t.equals(
    res.data.errors[0].param,
    'type',
    'errors should include the field name'
  )
})

test('organization-ingress - id is required', async t => {
  const res = await postAllowErrors(orgUrl, {
    type: 'ORGANIZATION',
    code: 'FOO'
  })
  t.equals(res.status, 400, 'no id should return a 400')
  t.equals(
    res.data.errors[0].param,
    'id',
    'errors should include the field name'
  )
})

test('organization-ingress - code is required', async t => {
  const res = await postAllowErrors(orgUrl, {
    type: 'ORGANIZATION',
    id: '1111111-2222-1111-1111-1111111111'
  })

  t.equals(res.status, 400, 'no code should return a 400')
  t.equals(
    res.data.errors[0].param,
    'code',
    'errors should include the field name'
  )
})

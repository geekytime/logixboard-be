import mongo from './utils/mongo-test'
import test from 'tape'
import { sendAllMessages } from './utils/send-all-messages'

// Tests like this could be replaced by simpler, more targeted tests,
// but I didn't want to deviate to far from the spirit of the assessment
test('organizations-messages - org records are correct after send-all-messages', async t => {
  await mongo.dropCollections()
  await sendAllMessages()

  const orgDocs = await mongo.find('organizations', {}, { code: 1 })
  t.equals(orgDocs.length, 3, 'there should be 3 orgs')
  t.equals(orgDocs[0].code, 'BOG', 'code')
  t.equals(
    orgDocs[0].externalId,
    '99f2535b-3f90-4758-8549-5b13c43a8504',
    'externalId'
  )

  t.equals(orgDocs[1].code, 'NAM', 'code')
  t.equals(
    orgDocs[1].externalId,
    '34f195b5-2aa1-4914-85ab-f8849f9b541a',
    'externalId'
  )

  t.equals(orgDocs[2].code, 'SEA', 'code')
  t.equals(
    orgDocs[2].externalId,
    '381f5cc5-dfe4-4f58-98ad-116666855ca3',
    'externalId'
  )
})

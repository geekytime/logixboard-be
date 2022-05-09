import mongo from './utils/mongo-test'
import test from 'tape'
import { sendAllMessages } from './utils/send-all-messages'

// Tests like this could be replaced by simpler, more targeted tests,
// but I didn't want to deviate to far from the spirit of the assessment
test('shipments-messages - records are correct after send-all-messages', async t => {
  await mongo.dropCollections()
  await sendAllMessages()

  const orgs = await mongo.find('organizations', {}, { code: 1 })
  const shipments = await mongo.find('shipments', {}, { referenceId: 1 })
  t.equals(shipments.length, 6, 'there should be 6 total shipments')

  // Stacking lots of asserts in one test isn't optimal,
  // but it avoids reloading the message data multiple times
  assertShipmentWithNoOrgs(t, shipments)
  assertShipmentWithNullETA(t, shipments)
  assertShipmentWithUpdatedOrgCodes(t, shipments, orgs)
  assertShipmentWithMismatchedOrgCodes(t, shipments, orgs)
})

const assertShipmentWithNoOrgs = (t: test.Test, shipments: any) => {
  const doc = shipments.find((doc: any) => doc.referenceId === 'S00001009')
  t.deepEquals(doc.organizationIds, [], 'shipment with no orgs')
}

const assertShipmentWithNullETA = (t: test.Test, shipments: any) => {
  const doc = shipments.find((doc: any) => doc.referenceId === 'S00001197')
  t.equals(
    doc.estimatedTimeArrival,
    null,
    'shipment with null estimatedTimeArrival'
  )
}

const assertShipmentWithUpdatedOrgCodes = (
  t: test.Test,
  shipments: any,
  orgs: any
) => {
  const shipment = shipments.find((doc: any) => doc.referenceId === 'S00001175')
  const matchingOrgIds = findMatchingOrgIds(orgs, 'SEA')
  t.deepEquals(shipment.organizationIds, matchingOrgIds, 'org ids should match')
}

const assertShipmentWithMismatchedOrgCodes = (
  t: test.Test,
  shipments: any,
  orgs: any
) => {
  const shipment = shipments.find((doc: any) => doc.referenceId === 'S00001142')
  const matchingOrgIds = findMatchingOrgIds(orgs, 'NAM')
  t.deepEquals(
    shipment.organizationIds,
    matchingOrgIds,
    'org still linked after code changed from `FMT` to `NAM`'
  )
}

const findMatchingOrgIds = (orgDocs: any, code: string) => {
  const matchingOrgs = orgDocs.filter((doc: any) => doc.code === code)
  const matchingOrgIds = matchingOrgs.map((doc: any) => doc._id)
  return matchingOrgIds
}

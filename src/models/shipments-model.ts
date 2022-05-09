import mongo from '../mongo'
import { createDebug } from '../utils/create-debug'
import organizations from './organizations-model'

const debug = createDebug('shipments-model')

const shipmentsCollectionName = 'shipments'

export type ShipmentInputShape = {
  referenceId: string
  organizationCodes: string[]
  estimatedTimeArrival?: string
  transportPacks?: any
}
export const upsertOne = async (input: ShipmentInputShape) => {
  const query = {
    referenceId: input.referenceId
  }

  const organizationIds = await fetchOrganizationIds(input.organizationCodes)

  // TODO: better handling for when org codes don't exist
  const update = {
    referenceId: input.referenceId,
    organizationIds,
    estimatedTimeArrival: input.estimatedTimeArrival,
    transportPacks: input.transportPacks || { nodes: [] }
  }
  debug('set orgs for', input.referenceId, '->', input.organizationCodes)

  const id = await mongo.upsertOne(shipmentsCollectionName, query, update)
  return id
}

export const fetchOrganizationIds = async (organizationCodes: string[]) => {
  const organizationDocs = await organizations.findByCodes(organizationCodes)
  const organizationIds = organizationDocs.map(org => org._id)
  return organizationIds
}

export const findAll = async () => {
  return mongo.find(shipmentsCollectionName, {})
}

export const findById = async (shipmentId: string) => {
  return mongo.findById(shipmentsCollectionName, shipmentId)
}

export default {
  findAll,
  findById,
  upsertOne
}

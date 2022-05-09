import mongo from '../mongo'
import { createDebug } from '../utils/create-debug'
const debug = createDebug('organizations-model')

const organizationsCollectionName = 'organizations'

export type OrganizationInsertShape = {
  externalId: string
  code: string
}

export const upsertOne = async (input: OrganizationInsertShape) => {
  debug('set code for', input.externalId, '->', input.code)

  const filter = {
    externalId: input.externalId
  }

  const update = {
    externalId: input.externalId,
    code: input.code
  }

  const _id = await mongo.upsertOne(organizationsCollectionName, filter, update)
  return _id
}

export const findById = async (organizationId: string) => {
  return mongo.findById(organizationsCollectionName, organizationId)
}

export const findByCodes = async (codes: string[] = []) => {
  const filter = { code: { $in: codes } }
  const docs = mongo.find(organizationsCollectionName, filter)
  return docs
}

export default {
  findByCodes,
  findById,
  upsertOne
}

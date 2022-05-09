import mongo, { connect } from '../../src/mongo'

export const dropCollection = async (collectionName: string) => {
  const db = await connect()
  try {
    await db.dropCollection(collectionName)
  } catch (error) {
    // Don't worry if the collection doesn't exist
  }
}

const allCollectionNames = ['organizations', 'shipments']
export const dropCollections = async (
  collectionNames: string[] = allCollectionNames
) => {
  const allDrops = collectionNames.map((collectionName: string) => {
    return dropCollection(collectionName)
  })
  await Promise.all(allDrops)
}

export default {
  ...mongo,
  dropCollection,
  dropCollections
}

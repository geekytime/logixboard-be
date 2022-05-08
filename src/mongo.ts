import { createDebug } from './utils/create-debug'
import {
  Collection,
  Db,
  Document,
  Filter,
  MongoClient,
  ObjectId,
  ServerApiVersion,
  Sort,
  WithId
} from 'mongodb'
import path from 'path'

const debug = createDebug('mongo')

const certPathRelative = '../secrets/X509-cert-3298877687696836469.pem'
const certPathAbsolute = path.join(__dirname, certPathRelative)
const mongoUrl =
  'mongodb+srv://cluster0.sjcpa.mongodb.net/logixboard?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority'

let _client: MongoClient | null = null

export const getClientInstance = (): MongoClient => {
  if (_client === null) {
    const config = {
      sslKey: certPathAbsolute,
      sslCert: certPathAbsolute,
      serverApi: ServerApiVersion.v1
    }
    _client = new MongoClient(mongoUrl, config)
  }
  return _client
}

export const connect = async (): Promise<Db> => {
  const client = getClientInstance()
  await client.connect()
  const db = client.db('logixboard')
  return db
}

export const getCollection = async (
  collectionName: string
): Promise<Collection> => {
  const db = await connect()
  const collection = db.collection(collectionName)
  return collection
}

export const upsertOne = async (
  collectionName: string,
  filter: Filter<Document>,
  doc: Partial<Document>
): Promise<string> => {
  debug('upsertOne', { collectionName, filter, doc })
  const existingDoc = await findOne(collectionName, filter)
  debug('upsertOne', { existingDoc })
  if (existingDoc) {
    return updateOneById(collectionName, existingDoc._id.toString(), doc)
  }
  return insertOne(collectionName, doc)
}

export const updateOneById = async (
  collectionName: string,
  _id: string,
  doc: Partial<Document>
) => {
  const collection = await getCollection(collectionName)
  const filter = { _id: new ObjectId(_id) }
  const update = { $set: doc }
  const result = await collection.updateOne(filter, update)
  if (result.modifiedCount !== 1) {
    console.error('updateOneById error', { collectionName, _id, result })
    throw new Error('updateOneById error')
  }
  return _id
}

export const find = async (
  collectionName: string,
  filter: Filter<Document>,
  sort?: Sort
): Promise<WithId<Document>[]> => {
  const cursor = await findMaybeSort(collectionName, filter, sort)
  const docs = await cursor.toArray()
  return docs
}

export const findOne = async (
  collectionName: string,
  filter: Filter<Document>
) => {
  const collection = await getCollection(collectionName)
  const doc = await collection.findOne(filter)
  return doc
}

export const findById = async (collectionName: string, id: string) => {
  const collection = await getCollection(collectionName)
  const filter = {
    _id: new ObjectId(id)
  }
  const doc = await collection.findOne(filter)
  return doc
}

const findMaybeSort = async (
  collectionName: string,
  filter: Filter<Document>,
  sort?: Sort
) => {
  const collection = await getCollection(collectionName)
  if (sort) {
    return collection.find(filter).sort(sort)
  }
  return collection.find(filter)
}

const insertOne = async (collectionName: string, doc: any) => {
  const collection = await getCollection(collectionName)
  const result = await collection.insertOne(doc)
  return result.insertedId.toString()
}

export default {
  find,
  findById,
  findOne,
  getClientInstance,
  upsertOne
}

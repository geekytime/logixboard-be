import { Request, Response, Router } from 'express'
import { body, validateInputs } from '../middleware/validation'
import shipments from '../models/shipments-model'

const handlePost = async (req: Request, res: Response) => {
  const { body } = req
  const input = {
    referenceId: body.referenceId,
    organizationCodes: body.organizations,
    estimatedTimeArrival: body.estimatedTimeArrival,
    transportPacks: body.transportPacks
  }
  const _id = await shipments.upsertOne(input)
  res.status(201).send({ _id })
}

const sanitizers = [
  body('organizations').customSanitizer(value => {
    return value || []
  }),
  body('transportPacks').customSanitizer(value => {
    return value || { nodes: [] }
  })
]

const validators = [
  body('type').equals('SHIPMENT'),
  body('referenceId')
    .not()
    .isEmpty()
]

export const createShipmentRouter = () => {
  const router = Router()
  router.post('/', sanitizers, validateInputs(validators), handlePost)
  return router
}

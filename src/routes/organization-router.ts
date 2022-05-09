import { Request, Response, Router } from 'express'
import { body, validateInputs } from '../middleware/validation'
import organizations from '../models/organizations-model'

const handlePost = async (req: Request, res: Response) => {
  const { body } = req
  const input = {
    externalId: body.id,
    code: body.code
  }
  const _id = await organizations.upsertOne(input)
  res.status(201).send({ _id })
}

const validators = [
  body('type').equals('ORGANIZATION'),
  body('id')
    .not()
    .isEmpty(),
  body('code')
    .not()
    .isEmpty()
]

export const createOrganizationRouter = () => {
  const router = Router()
  router.post('/', validateInputs(validators), handlePost)
  return router
}

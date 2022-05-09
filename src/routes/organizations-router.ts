import { Request, Response, Router } from 'express'
import organizations from '../models/organizations-model'

const handleGet = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const organization = await organizations.findById(organizationId)
  res.status(200).send(organization)
}

export const createOrganizationsRouter = () => {
  const router = Router()
  router.get('/:organizationId', handleGet)
  return router
}

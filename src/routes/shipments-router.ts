import { Request, Response, Router } from 'express'
import shipments from '../models/shipments-model'

const handleGet = async (req: Request, res: Response) => {
  const { shipmentId } = req.params
  const shipment = await shipments.findById(shipmentId)
  res.status(200).send(shipment)
}

export const createShipmentsRouter = () => {
  const router = Router()
  router.get('/:shipmentId', handleGet)
  return router
}

import { Request, Response, Router } from 'express'
import { query, validateInputs } from '../middleware/validation'
import { WeightUnits, WeightUnitsValues } from '../utils/weight-utils'
import shipmentWeightsModel from '../models/shipment-weights-model'

const handleGet = async (req: Request, res: Response) => {
  const { desiredUnits } = req.query
  const weight = await shipmentWeightsModel.aggregateAll(
    desiredUnits as WeightUnits
  )
  res.status(200).send({ weight, units: desiredUnits })
}
const validators = [query('desiredUnits').isIn(WeightUnitsValues)]

export const createShipmentWeightsRouter = () => {
  const router = Router()
  router.get('/', validateInputs(validators), handleGet)
  return router
}

import express from 'express'
import bodyParser from 'body-parser'

import { createShipmentRouter } from './routes/shipment-router'
import { createOrganizationRouter } from './routes/organization-router'
import { createOrganizationsRouter } from './routes/organizations-router'
import { createShipmentsRouter } from './routes/shipments-router'
import { createShipmentWeightsRouter } from './routes/shipment-weights-router'

export const createServer = () => {
  const app = express()
  app.use(bodyParser.json())

  app.use('/shipment', createShipmentRouter())

  app.use('/organization', createOrganizationRouter())

  app.use('/shipments', createShipmentsRouter())

  app.use('/organizations', createOrganizationsRouter())

  app.use('/shipment-weights', createShipmentWeightsRouter())

  return app
}

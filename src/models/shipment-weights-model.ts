import { convertWeight, WeightUnits } from '../utils/weight-utils'
import shipmentsModel from './shipments-model'

export const aggregateAll = async (desiredUnits: WeightUnits) => {
  const shipments = await shipmentsModel.findAll()
  const startingWeight = 0
  return shipments.reduce((totalWeight, shipment) => {
    return totalWeight + aggregateNodeWeights(shipment, desiredUnits)
  }, startingWeight)
}

const aggregateNodeWeights = (shipment: any, desiredUnits: WeightUnits) => {
  if (!shipment.transportPacks?.nodes) {
    return 0
  }

  const startingWeight = 0
  const nodes = shipment.transportPacks.nodes || []
  return nodes.reduce((packWeight: number, node: any) => {
    return packWeight + normalizeNodeWeight(node, desiredUnits)
  }, startingWeight)
}

const normalizeNodeWeight = (node: any, desiredUnits: WeightUnits) => {
  const nodeWeight = Number.parseFloat(node.totalWeight.weight)
  if (node.totalWeight.unit === desiredUnits) {
    return nodeWeight
  }
  return convertWeight(nodeWeight, node.totalWeight.unit, desiredUnits)
}

export default {
  aggregateAll
}

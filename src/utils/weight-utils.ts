import convertUnits, { Unit } from 'convert-units'
//@ts-ignore
import expectedRound from 'expected-round'

export type WeightUnits = 'KILOGRAMS' | 'POUNDS' | 'OUNCES'
export const WeightUnitsValues: WeightUnits[] = [
  'KILOGRAMS',
  'POUNDS',
  'OUNCES'
]

const shortUnits = {
  KILOGRAMS: 'kg',
  OUNCES: 'oz',
  POUNDS: 'lb'
}

export const convertWeight = (
  weight: number,
  fromUnits: WeightUnits,
  toUnits: WeightUnits,
  precision: number = -4
) => {
  const fromShort = shortUnits[fromUnits] as Unit
  const toShort = shortUnits[toUnits] as Unit

  const inDesiredUnits = convertUnits(weight)
    .from(fromShort)
    .to(toShort)

  return expectedRound.round10(inDesiredUnits, precision)
}

import { NextFunction, Request, Response } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
export { body, query } from 'express-validator'

export const validateInputs = (validators: ValidationChain[]) => {
  const checkValidators = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }

  return [...validators, checkValidators]
}

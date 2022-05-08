import debug from 'debug'

export const createDebug = (namespace: string) => {
  const fullNamespace = `lb:${namespace}`
  return debug(fullNamespace)
}

const cache = new Map<string, unknown>()

export function getCache(key: string) {
  return cache.get(key)
}

export function setCache(key: string, value: unknown) {
  cache.set(key, value)
}

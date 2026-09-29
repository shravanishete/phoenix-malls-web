const POOL_SIZE = 10

const POOL = Array.from(
  { length: POOL_SIZE },
  (_, i) => `/images/malls/pool/mall-${i + 1}.jpg`,
)

function hash(seed: string): number {
  let h = 0
  for (const char of seed) {
    h = (h * 31 + char.charCodeAt(0)) >>> 0
  }
  return h
}


export function getPoolImages(seed: string): string[] {
  if (POOL.length === 0) return []
  const start = hash(seed) % POOL.length
  return [...POOL.slice(start), ...POOL.slice(0, start)]
}
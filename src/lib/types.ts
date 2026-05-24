export type City = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export type CachedTemp = {
  celsius: number
  fetchedAt: number
}

export type Unit = 'C' | 'F'

export type View = 'glass' | 'number'

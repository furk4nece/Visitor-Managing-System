import { jwtDecode } from 'jwt-decode'

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'RECEPTIONIST'

export interface DecodedToken {
  sub: string
  upn?: string
  groups?: Role[]
  exp: number
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}

export function isTokenExpired(decoded: DecodedToken | null): boolean {
  if (!decoded) return true
  return decoded.exp * 1000 < Date.now()
}

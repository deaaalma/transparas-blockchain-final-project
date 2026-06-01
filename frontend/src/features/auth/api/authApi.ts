import { api } from '../../../lib/axios'

export interface LoginPayload { email: string; password: string }
export interface LoginResponse {
  token: string
  user: { id: string; name: string; email: string }
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then(r => r.data),
  logout: () =>
    api.post('/auth/logout').then(r => r.data),
}

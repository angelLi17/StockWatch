import axios from 'axios'
import { auth } from './firebase'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
})

// Attach the logged-in user's Firebase ID token to every request.
// getIdToken() refreshes the token automatically when it expires.
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    config.headers.Authorization = `Bearer ${await user.getIdToken()}`
  }
  return config
})

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

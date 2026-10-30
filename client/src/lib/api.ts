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

// If the API URL is wrong, the host serves the React app's index.html instead of JSON.
// Fail with a clear message rather than letting pages crash on unexpected data.
api.interceptors.response.use((response) => {
  const type = String(response.headers['content-type'] ?? '')
  if (response.status !== 204 && !type.includes('application/json')) {
    throw new Error(
      `Expected data from the API but got a web page from ${response.config.baseURL}${response.config.url}. ` +
        'Check that VITE_API_URL points to the Express server, then redeploy.',
    )
  }
  return response
})

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('zs_token') || null,
  user: null,

  setToken: (token) => {
    localStorage.setItem('zs_token', token)
    set({ token })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('zs_token')
    set({ token: null, user: null })
  },
}))

export default useAuthStore

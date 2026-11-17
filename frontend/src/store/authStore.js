import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('vpn_token') || null,
  user: null,

  setToken: (token) => {
    localStorage.setItem('vpn_token', token)
    set({ token })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('vpn_token')
    set({ token: null, user: null })
  },
}))

export default useAuthStore

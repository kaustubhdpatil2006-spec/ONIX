import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// This store holds the logged-in user's data globally
// 'persist' means it saves to localStorage — so login survives page refresh

const useAuthStore = create(
  persist(
    (set) => ({
      // --- STATE ---
      user: null,        // Will hold { name, role } when logged in
      isAuthenticated: false,

      // --- ACTIONS ---
      login: (userData) => set({
        user: userData,
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage', // Key name in localStorage
    }
  )
)

export default useAuthStore
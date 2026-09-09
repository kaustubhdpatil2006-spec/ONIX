// Mock user directory — not connected to real auth yet.
// Note: your current login is free-text (any name + role picker), so this
// list is just for the Admin page demo. A real backend would replace this
// with an actual user table, and login would look users up instead of
// accepting any typed name.
export const mockUsers = [
  { id: 'u1', name: 'Aditri Patil', role: 'officer' },
  { id: 'u2', name: 'Rahul Verma', role: 'officer' },
  { id: 'u3', name: 'Priya Sharma', role: 'admin' },
]
import Navbar from './Navbar'

// Wraps any protected page: Navbar on top, page content below.
// Keeps every page consistent without repeating <Navbar /> everywhere.
export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}
import UsersTable from '../components/dashboard/UsersTable'
import ScansByOfficer from '../components/dashboard/ScansByOfficer'

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage officers and review compliance activity across the team.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        <UsersTable />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Scans by Officer</h2>
        <ScansByOfficer />
      </section>
    </div>
  )
}
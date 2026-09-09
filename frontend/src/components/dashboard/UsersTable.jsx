import useScanStore from '../../store/scanStore'
import { mockUsers } from '../../constants/mockUsers'

export default function UsersTable() {
  const history = useScanStore((state) => state.history)

  // For each mock user, count how many scans in history match their name.
  // Matching by name (not a real userId) since that's all our mock data has.
  const usersWithCounts = mockUsers.map((u) => ({
    ...u,
    scanCount: history.filter((scan) => scan.officerName === u.name).length,
  }))

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Scans Completed</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {usersWithCounts.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3 text-gray-700">{u.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    u.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {u.role === 'admin' ? 'Admin' : 'Officer'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{u.scanCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
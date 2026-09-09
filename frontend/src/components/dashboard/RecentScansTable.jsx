// Reads scan history directly from the store — no props needed.
// Dashboard just drops this in and it stays in sync automatically.
import useScanStore from '../../store/scanStore'

export default function RecentScansTable() {
  const history = useScanStore((state) => state.history)

  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No scans yet.
      </p>
    )
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Rules Passed</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {history.map((scan) => {
            const passCount = scan.rules.filter((r) => r.status === 'pass').length
            const total = scan.rules.length
            const compliant = passCount === total

            return (
              <tr key={scan.id}>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(scan.date).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {passCount} / {total}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      compliant
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {compliant ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
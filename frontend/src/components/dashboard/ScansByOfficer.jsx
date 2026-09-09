import useScanStore from '../../store/scanStore'

// Groups the flat history array into { officerName: [scans...] } buckets.
function groupByOfficer(history) {
  const groups = {}

  history.forEach((scan) => {
    const key = scan.officerName || 'Unknown'
    if (!groups[key]) groups[key] = []
    groups[key].push(scan)
  })

  return groups
}

export default function ScansByOfficer() {
  const history = useScanStore((state) => state.history)

  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No scans recorded yet.
      </p>
    )
  }

  const grouped = groupByOfficer(history)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([officerName, scans]) => (
        <div key={officerName} className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{officerName}</h3>
            <span className="text-xs text-gray-500">
              {scans.length} scan{scans.length !== 1 ? 's' : ''}
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Rules Passed</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {scans.map((scan) => {
                const passCount = scan.rules.filter((r) => r.status === 'pass').length
                const total = scan.rules.length
                const compliant = passCount === total

                return (
                  <tr key={scan.id}>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(scan.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {passCount} / {total}
                    </td>
                    <td className="px-4 py-2">
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
      ))}
    </div>
  )
}
import useScanStore from '../../store/scanStore'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Aggregates pass/fail counts per rule name across ALL scans in history.
// e.g. if "Net Quantity" failed in 2 scans and passed in 5, that's one
// bar showing { name: 'Net Quantity', pass: 5, fail: 2 }
function aggregateRuleStats(history) {
  const statsMap = {}

  history.forEach((scan) => {
    scan.rules.forEach((rule) => {
      if (!statsMap[rule.name]) {
        statsMap[rule.name] = { name: rule.name, pass: 0, fail: 0 }
      }
      if (rule.status === 'pass') {
        statsMap[rule.name].pass += 1
      } else {
        statsMap[rule.name].fail += 1
      }
    })
  })

  return Object.values(statsMap)
}

export default function ComplianceChart() {
  const history = useScanStore((state) => state.history)

  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No data to chart yet.
      </p>
    )
  }

  const data = aggregateRuleStats(history)

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Compliance by Rule (All Scans)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pass" fill="#22c55e" name="Compliant" />
          <Bar dataKey="fail" fill="#ef4444" name="Violation" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
import useScanStore from '../store/scanStore'
import StatsCard from '../components/dashboard/StatsCard'
import RecentScansTable from '../components/dashboard/RecentScansTable'
import ComplianceChart from '../components/dashboard/ComplianceChart'

export default function DashboardPage() {
  const history = useScanStore((state) => state.history)

  const totalScans = history.length

  const totalRuleChecks = history.reduce((sum, scan) => sum + scan.rules.length, 0)
  const totalPasses = history.reduce(
    (sum, scan) => sum + scan.rules.filter((r) => r.status === 'pass').length,
    0
  )
  const complianceRate =
    totalRuleChecks === 0 ? 0 : Math.round((totalPasses / totalRuleChecks) * 100)

  const totalViolations = totalRuleChecks - totalPasses

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Scans" value={totalScans} />
        <StatsCard
          label="Compliance Rate"
          value={`${complianceRate}%`}
          tone={complianceRate >= 70 ? 'good' : 'bad'}
        />
        <StatsCard
          label="Violations Found"
          value={totalViolations}
          tone={totalViolations > 0 ? 'bad' : 'default'}
          sublabel="Across all scans"
        />
      </div>

      <ComplianceChart />

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Scans</h2>
        <RecentScansTable />
      </div>
    </div>
  )
}
import useScanStore from '../store/scanStore'
import { Button } from '../components/ui/button'
import { exportReportAsPdf } from '../utils/pdfExport'

export default function ReportPage() {
  const results = useScanStore((state) => state.results)

  if (!results) {
    return (
      <p className="text-center text-gray-500 py-20">
        No report available. Start a new scan first.
      </p>
    )
  }

  const passCount = results.rules.filter((r) => r.status === 'pass').length
  const overallCompliant = passCount === results.rules.length
  const now = new Date()

  const handleDownload = () => {
    exportReportAsPdf(results, `compliance-report-${Date.now()}.pdf`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compliance Report</h1>
        <Button onClick={handleDownload}>Download PDF</Button>
      </div>

      <div className="bg-white border rounded-lg p-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">Legal Metrology Compliance Report</h2>
            <p className="text-xs text-gray-500">
              Generated on {now.toLocaleDateString()} at {now.toLocaleTimeString()}
            </p>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              overallCompliant
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {overallCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
          </span>
        </div>

        <div className="space-y-4">
          {results.images.map((imageUrl, index) => (
            <div key={imageUrl}>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Image {index + 1}
              </p>

              <img
                src={imageUrl}
                alt={`Scanned package ${index + 1}`}
                className="w-full max-h-64 object-contain rounded border"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">
            {passCount} of {results.rules.length} mandatory declarations compliant
          </p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Rule</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.rules.map((rule) => (
                <tr key={rule.id} className="border-b last:border-0">
                  <td className="py-2">{rule.name}</td>
                  <td
                    className={`py-2 text-right font-medium ${
                      rule.status === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {rule.status === 'pass' ? 'Pass' : 'Fail'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import useScanStore from '../store/scanStore'
import useScan from '../hooks/useScan'
import ScanningOverlay from '../components/shared/ScanningOverlay'
import BoundingBoxCanvas from '../components/results/BoundingBoxCanvas'
import ComplianceChecklist from '../components/results/ComplianceChecklist'
import { Button } from '../components/ui/button'

export default function ResultsPage() {
  const isScanning = useScanStore((state) => state.isScanning)
  const results = useScanStore((state) => state.results)
  const navigate = useNavigate()

  useScan()

  // Show scanning screen while analysis is running
  if (isScanning) {
    return <ScanningOverlay />
  }

  // If there are no results
  if (!results) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900">
          No scan results yet
        </h2>

        <p className="text-gray-500 mt-2">
          Go to the Scan page to upload a product and start an analysis.
        </p>

        <Button
          className="mt-6"
          onClick={() => navigate('/scan')}
        >
          Go to Scan
        </Button>
      </div>
    )
  }

  // Calculate compliance statistics
  const passCount = results.rules.filter(
    (rule) => rule.status === 'pass'
  ).length

  const failCount = results.rules.filter(
    (rule) => rule.status === 'fail'
  ).length

  const totalRules = results.rules.length

  const complianceRate =
    totalRules > 0
      ? Math.round((passCount / totalRules) * 100)
      : 0

  const isCompliant = failCount === 0

  const failedRules = results.rules.filter(
    (rule) => rule.status === 'fail'
  )

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scan Results
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Legal Metrology compliance analysis
          </p>
        </div>

        <span className="text-sm font-medium text-gray-500">
          {passCount} / {totalRules} rules compliant
        </span>
      </div>

      {/* Overall Compliance Banner */}
      <div
        className={`rounded-xl border p-5 ${
          isCompliant
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <p
              className={`text-sm font-medium ${
                isCompliant
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              Overall Compliance Status
            </p>

            <h2
              className={`text-2xl font-bold mt-1 ${
                isCompliant
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}
            >
              {isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {passCount} of {totalRules} mandatory declarations passed
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">
              Compliance Rate
            </p>

            <p
              className={`text-3xl font-bold ${
                isCompliant
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {complianceRate}%
            </p>
          </div>

        </div>
      </div>

      {/* Violation Summary */}
      {failCount > 0 && (
        <div className="rounded-xl border border-red-200 bg-white overflow-hidden">

          <div className="px-5 py-4 bg-red-50 border-b border-red-200">
            <h2 className="font-semibold text-red-800">
              Violations Found
            </h2>

            <p className="text-sm text-red-600 mt-1">
              {failCount} compliance rule
              {failCount !== 1 ? 's' : ''} require attention.
            </p>
          </div>

          <div className="divide-y">
            {failedRules.map((rule) => (
              <div
                key={rule.id}
                className="px-5 py-3 flex items-center gap-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold">
                  !
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {rule.name}
                </span>

                <span className="ml-auto text-xs font-semibold text-red-600">
                  Violation
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Images + Checklist */}
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6">

        {/* Package Images */}
        <div className="space-y-5">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Package Images
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Detected declarations are highlighted below.
            </p>
          </div>

          {results.images.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {index === 0 ? 'Front Image' : 'Back Image'}
                </p>

                <span className="text-xs text-gray-400">
                  Image {index + 1}
                </span>
              </div>

              <div className="rounded-xl border bg-white p-2 shadow-sm">
                <BoundingBoxCanvas
                  imageUrl={imageUrl}
                  rules={results.rules}
                />
              </div>
            </div>
          ))}

        </div>

        {/* Compliance Checklist */}
        <div className="space-y-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Compliance Checklist
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Mandatory declarations evaluated during analysis.
            </p>
          </div>

          <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            <ComplianceChecklist
              rules={results.rules}
            />
          </div>

        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">

        <Button
          variant="outline"
          onClick={() => navigate('/scan')}
        >
          Scan Another Product
        </Button>

        <Button
          size="lg"
          onClick={() => navigate('/report')}
        >
          View Full Report
        </Button>

      </div>

    </div>
  )
}
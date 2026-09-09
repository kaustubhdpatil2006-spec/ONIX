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

  if (isScanning) {
    return <ScanningOverlay />
  }

  if (!results) {
    return (
      <p className="text-center text-gray-500 py-20">
        No scan results yet. Go to the Scan page to start.
      </p>
    )
  }

  const passCount = results.rules.filter((r) => r.status === 'pass').length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scan Results</h1>
        <span className="text-sm text-gray-500">
          {passCount} / {results.rules.length} rules compliant
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        {results.images.map((imageUrl, index) => (
          <div key={imageUrl} className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              Image {index + 1}
            </p>

             <BoundingBoxCanvas
              imageUrl={imageUrl}
              rules={results.rules}
             />
            </div>
          ))}
        </div>
        <ComplianceChecklist rules={results.rules} />
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => navigate('/report')}>
          View Full Report
        </Button>
      </div>
    </div>
  )
}
import useScanStore from '../store/scanStore'
import useScan from '../hooks/useScan'
import ScanningOverlay from '../components/shared/ScanningOverlay'

export default function ResultsPage() {
  const isScanning = useScanStore((state) => state.isScanning)
  const results = useScanStore((state) => state.results)

  useScan() // fires the mock "backend call" whenever isScanning is true

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

  // Temporary raw preview — real bounding boxes + checklist come in Step 5
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan Results (raw preview)</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  )
}
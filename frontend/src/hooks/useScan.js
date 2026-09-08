import { useEffect } from 'react'
import useScanStore from '../store/scanStore'

// This hook fires the "analyze images" call once when a component mounts
// with isScanning = true. Right now it's mocked with setTimeout;
// later you'll swap the inside of the timeout for a real axios call.
export default function useScan() {
  const isScanning = useScanStore((state) => state.isScanning)
  const images = useScanStore((state) => state.images)
  const setResults = useScanStore((state) => state.setResults)

  useEffect(() => {
    if (!isScanning) return

    // MOCK BACKEND CALL — replace this block with a real API call later.
    const timer = setTimeout(() => {
      const mockResult = {
        imageUrl: images[0]?.previewUrl,
        overallStatus: 'partial', // 'compliant' | 'partial' | 'non_compliant'
        rules: [
          { id: 1, name: 'MRP Declaration', status: 'pass', box: { x: 10, y: 10, w: 30, h: 10 } },
          { id: 2, name: 'Net Quantity', status: 'pass', box: { x: 10, y: 25, w: 35, h: 10 } },
          { id: 3, name: "Manufacturer's Name & Address", status: 'fail', box: { x: 10, y: 40, w: 60, h: 12 } },
          { id: 4, name: 'Consumer Care Details', status: 'fail', box: { x: 10, y: 55, w: 50, h: 10 } },
          { id: 5, name: 'Date of Manufacture', status: 'pass', box: { x: 10, y: 70, w: 30, h: 8 } },
          { id: 6, name: 'Font Size Compliance', status: 'pass', box: { x: 10, y: 82, w: 25, h: 8 } },
        ],
      }

      setResults(mockResult) // this also flips isScanning back to false
    }, 2500) // simulate network + OCR/NLP delay

    return () => clearTimeout(timer) // cleanup if component unmounts mid-scan
  }, [isScanning])
}
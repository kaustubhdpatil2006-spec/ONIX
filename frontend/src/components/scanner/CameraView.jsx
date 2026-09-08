import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useScanStore from '../../store/scanStore'
import { Button } from '../ui/button'
import AlignmentGuide from './AlignmentGuide'

// Converts a base64 data URL (what react-webcam gives us) into a File object
// so it behaves exactly like an uploaded file in our store.
function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new File([bytes], filename, { type: mime })
}

export default function CameraView({ onCapture }) {
  const webcamRef = useRef(null)
  const addImages = useScanStore((state) => state.addImages)
  const [error, setError] = useState(null)

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) return

    const file = dataUrlToFile(screenshot, `capture-${Date.now()}.jpg`)
    addImages([file])
    onCapture?.() // optional callback, e.g. to switch tabs back to preview
  }

  return (
    <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black">
      {error ? (
        <p className="text-red-500 text-sm p-4">
          Camera access failed: {error}. Please allow camera permission or use upload instead.
        </p>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }} // prefers back camera on mobile
            onUserMediaError={(err) => setError(err.message || 'permission denied')}
            className="w-full"
          />
          <AlignmentGuide />
        </>
      )}

      <div className="p-3 bg-black/80 flex justify-center">
        <Button onClick={handleCapture} disabled={!!error}>
          📷 Capture
        </Button>
      </div>
    </div>
  )
}
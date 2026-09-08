import { useNavigate } from 'react-router-dom'
import useScanStore from '../store/scanStore'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { Button } from '../components/ui/button'

import ImageUploader from '../components/scanner/ImageUploader'
import CameraView from '../components/scanner/CameraView'
import ImagePreviewGrid from '../components/scanner/ImagePreviewGrid'

export default function ScanPage() {
  const images = useScanStore((state) => state.images)
  const setScanning = useScanStore((state) => state.setScanning)
  const navigate = useNavigate()

  const handleStartScan = () => {
    if (images.length === 0) return // guard: nothing to scan

    // We'll actually call the backend in Step 4.
    // For now, just flip the flag and navigate to a results/loading screen.
    setScanning(true)
    navigate('/results')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Scan a Package</h1>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <ImageUploader />
        </TabsContent>

        <TabsContent value="camera">
          <CameraView />
        </TabsContent>
      </Tabs>

      {/* Shared preview — shows images from either tab */}
      <ImagePreviewGrid />

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleStartScan}
          disabled={images.length === 0}
        >
          Start Scan ({images.length} image{images.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  )
}
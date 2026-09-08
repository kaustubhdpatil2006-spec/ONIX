import ImageUploader from '../components/scanner/ImageUploader'
import ImagePreviewGrid from '../components/scanner/ImagePreviewGrid'

export default function ScanPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <ImageUploader />
      <ImagePreviewGrid />
    </div>
  )
}
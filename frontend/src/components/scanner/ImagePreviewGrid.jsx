import useScanStore from '../../store/scanStore'
import { X } from 'lucide-react' // installed automatically with shadcn/ui

export default function ImagePreviewGrid() {
  const images = useScanStore((state) => state.images)
  const removeImage = useScanStore((state) => state.removeImage)

  const handleRemove = (id, previewUrl) => {
    URL.revokeObjectURL(previewUrl) // cleanup, as flagged in Step 3A
    removeImage(id)
  }

  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {images.map((img) => (
        <div key={img.id} className="relative group">
          <img
            src={img.previewUrl}
            alt="Package preview"
            className="w-full h-32 object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={() => handleRemove(img.id, img.previewUrl)}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
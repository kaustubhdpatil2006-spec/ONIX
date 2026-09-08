import { useRef } from 'react'
import useScanStore from '../../store/scanStore'
import { Button } from '../ui/button'

export default function ImageUploader() {
  const inputRef = useRef(null)
  const addImages = useScanStore((state) => state.addImages)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      addImages(files)
    }
    // reset input so selecting the same file again still fires onChange
    e.target.value = ''
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
      onClick={() => inputRef.current.click()}
    >
      <p className="text-gray-500 mb-2">
        Click to upload package images
      </p>
      <p className="text-xs text-gray-400 mb-4">
        You can select multiple images at once
      </p>

      <Button type="button" variant="secondary">
        Choose Files
      </Button>

      {/* Hidden native input does the real work; the styled div above triggers it */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useScanStore from '../store/scanStore'
import { Button } from '../components/ui/button'

const PRODUCTS = [
  { id: 'amul-taaza', label: 'Amul Taaza Milk' },
  { id: 'bisleri', label: 'Bisleri Water' },
  { id: 'maggi', label: 'Maggi Noodles' },
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function UploadBox({ label, file, onChange, error }) {
  const inputId = `upload-${label.toLowerCase().replace(/\s+/g, '-')}`

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      onChange(null, 'File is too large. Maximum size is 10MB.')
      return
    }
    onChange(selectedFile, null)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          {label}
        </p>

        {file && (
          <span className="text-xs font-semibold text-green-600">
            ✓ Image ready
          </span>
        )}
      </div>

      <label
        htmlFor={inputId}
        className={`group relative h-72 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden transition-all ${
          error
            ? 'border-red-300 bg-red-50/30'
            : file
            ? 'border-green-300 bg-green-50/30'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'
        }`}
      >
        {file ? (
          <>
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="w-full h-full object-contain bg-white"
            />

            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2">
              <p className="text-xs text-white font-medium">
                Click to replace image
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-2xl">
              📷
            </div>

            <p className="font-semibold text-gray-800">
              Upload {label}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Click to upload or drag and drop
            </p>

            <p className="text-xs text-gray-400 mt-2">
              PNG or JPG • Maximum 10MB
            </p>
          </>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) =>
            handleFileChange(e.target.files?.[0] ?? null)
          }
        />
      </label>

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ScanPage() {
  const setScanning = useScanStore((state) => state.setScanning)
  const setImages = useScanStore((state) => state.setImages)
  const navigate = useNavigate()

  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const [productId, setProductId] = useState('')
  const [frontError, setFrontError] = useState(null)
  const [backError, setBackError] = useState(null)

  const canStart = Boolean(frontImage && backImage)

  const handleStartScan = () => {
    if (!canStart) return

    setImages([frontImage, backImage])

    setScanning(true)

    navigate('/results')
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Scan Product
        </h1>

        <p className="text-gray-500 mt-2">
          Upload clear images of the front and back of the package
          for compliance analysis.
        </p>
      </div>

      {/* Upload Section */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Package Images
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Both front and back images are required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <UploadBox
            label="Front Image"
            file={frontImage}
            error={frontError}
            onChange={(file, error) => {
              setFrontImage(file)
              setFrontError(error)
            }}
          />

          <UploadBox
            label="Back Image"
            file={backImage}
            error={backError}
            onChange={(file, error) => {
              setBackImage(file)
              setBackError(error)
            }}
          />

        </div>
      </div>

      {/* Product Selection */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Product
          <span className="font-normal text-gray-400 ml-1">
            (Optional)
          </span>
        </label>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            Select product or leave blank
          </option>

          {PRODUCTS.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.label}
            </option>
          ))}
        </select>
      </div>

      {/* Analysis Button */}
      <Button
        size="lg"
        className="w-full h-12 text-base"
        disabled={!canStart}
        onClick={handleStartScan}
      >
        {canStart
          ? 'Start Analysis'
          : 'Upload Front & Back Images'}
      </Button>

      {/* Tips */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

        <p className="font-semibold text-sm text-amber-900 mb-3">
          💡 Tips for better results
        </p>

        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Ensure good lighting</li>
          <li>• Keep all text clearly visible</li>
          <li>• Capture both front and back sides</li>
          <li>• Avoid blurry or tilted images</li>
        </ul>

      </div>

    </div>
  )
}
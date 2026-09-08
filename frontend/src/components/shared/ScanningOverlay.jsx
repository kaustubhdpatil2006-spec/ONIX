// Pure UI — a fullscreen-ish "analyzing" state with a spinner.
export default function ScanningOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-700">Analyzing image...</p>
      <p className="text-sm text-gray-400 mt-1">Running OCR & compliance checks</p>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'

// Draws the original image, then overlays colored rectangles for each rule.
// Box coordinates are percentages (0-100) of image width/height, so they
// scale correctly regardless of the image's natural resolution.
export default function BoundingBoxCanvas({ imageUrl, rules }) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (!imgLoaded) return

    const canvas = canvasRef.current
    const img = imgRef.current
    const ctx = canvas.getContext('2d')

    // Match canvas size to the actual rendered image size
    canvas.width = img.clientWidth
    canvas.height = img.clientHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    rules.forEach((rule) => {
      const { x, y, w, h } = rule.box
      const boxX = (x / 100) * canvas.width
      const boxY = (y / 100) * canvas.height
      const boxW = (w / 100) * canvas.width
      const boxH = (h / 100) * canvas.height

      ctx.strokeStyle = rule.status === 'pass' ? '#22c55e' : '#ef4444' // green-500 / red-500
      ctx.lineWidth = 3
      ctx.strokeRect(boxX, boxY, boxW, boxH)

      // Small label above the box
      ctx.fillStyle = rule.status === 'pass' ? '#22c55e' : '#ef4444'
      ctx.font = '12px sans-serif'
      ctx.fillText(rule.name, boxX, boxY - 4)
    })
  }, [imgLoaded, rules])

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Scanned package"
        className="w-full rounded-md border"
        onLoad={() => setImgLoaded(true)}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  )
}
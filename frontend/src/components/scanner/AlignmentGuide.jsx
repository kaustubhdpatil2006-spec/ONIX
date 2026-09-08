// Pure visual overlay — no logic. Absolutely positioned on top of the camera feed.
export default function AlignmentGuide() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="w-[80%] h-[70%] border-4 border-dashed border-green-400 rounded-lg" />
      <p className="absolute bottom-8 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        Align package label within the frame
      </p>
    </div>
  )
}
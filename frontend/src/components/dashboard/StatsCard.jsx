// Generic stat display — Dashboard will render 3-4 of these with different props.
// Kept dumb on purpose: no data-fetching or calculation logic here,
// just renders whatever numbers/labels it's given.
export default function StatsCard({ label, value, sublabel, tone = 'default' }) {
  const toneStyles = {
    default: 'text-gray-900',
    good: 'text-green-600',
    bad: 'text-red-600',
  }

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${toneStyles[tone]}`}>{value}</p>
      {sublabel && (
        <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
      )}
    </div>
  )
}